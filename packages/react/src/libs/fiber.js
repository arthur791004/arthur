import toArray from '../utils/toArray';
import { createDOMElement, createTextElement } from './dom';

export const INTERAL_KEYS = {
  FIBER: '_reactInternalFiber',
};

export const HTML_TYPES = {
  TEXT: 'text',
};

export const FIBER_TAGS = {
  FunctionComponent: 0,
  ClassComponent: 1,
  IndeterminateComponent: 2,
  HostRoot: 3,
  HostComponent: 5,
  HostText: 6,
};

export const EFFECT_TAGS = {
  NoEffect: 0,
  Placement: 2,
  Update: 4,
  Deletion: 8,
};

export const isRealDOM = tag =>
  tag === FIBER_TAGS.HostRoot ||
  tag === FIBER_TAGS.HostComponent ||
  tag === FIBER_TAGS.HostText;

const resolveComponentTag = (Component) => {
  if (typeof Component === 'function') {
    return Component.prototype && Component.prototype.isReactComponent
      ? FIBER_TAGS.ClassComponent
      : FIBER_TAGS.FunctionComponent;
  }

  return FIBER_TAGS.IndeterminateComponent;
}

const getFiberTagFromElement = (element) => {
  if (!(element instanceof Object)) {
    return FIBER_TAGS.HostText;
  }

  const { type } = element;
  if (typeof type === 'string') {
    return FIBER_TAGS.HostComponent;
  }

  return resolveComponentTag(type);
}

/**
 * Set effectTag to oldFiber and newFiber
 * @param {FiberNode} oldFiber
 * @param {FiberNode} newFiber
 * 
 * @returns {Array<FiberNode>}
 */
const resolveEffects = (oldFiber, newFiber) => {
  const effects = [];
  const oldType = oldFiber && oldFiber.type;
  const newType = newFiber && newFiber.type;
  const sameType = oldType === newType;
  const sameProps = oldFiber && oldFiber.props === newFiber.props;
  const sameState = !(oldFiber && oldFiber.state);

  if (newFiber) {
    let effectTag = EFFECT_TAGS.NoEffect;
    if (!sameType) {
      effectTag = EFFECT_TAGS.Placement;
    } else if (!(sameProps && sameState)) {
      effectTag = EFFECT_TAGS.Update;
    }

    newFiber.effectTag = effectTag;
    effects.push(newFiber);
  }

  if (oldFiber && !sameType) {
    oldFiber.effectTag = EFFECT_TAGS.Deletion;
    effects.push(oldFiber);
  }

  return effects
    .filter(fiber => !!fiber && fiber.effectTag !== EFFECT_TAGS.NoEffect);
};

const FiberNode = (tag, stateNode) => ({
  tag,
  stateNode,
});

export const createFiber = (tag, stateNode) => {
  return FiberNode(tag, stateNode);
};

export const createFiberFromElement = (element) => {
  if (element == null) {
    return null;
  }

  const tag = getFiberTagFromElement(element);
  const fiber = createFiber(tag);

  if (tag === FIBER_TAGS.HostText) {
    fiber.type = HTML_TYPES.TEXT;
    fiber.props = { nodeValue: element };
  } else {
    fiber.type = element.type;
    fiber.props = element.props;
  }

  return fiber;
}

export const getFiberFromInstance = instance => instance[INTERAL_KEYS.FIBER];

export const setFiberToInstance = (instance, fiber) => {
  instance[INTERAL_KEYS.FIBER] = fiber;
  return instance;
}

export const getFiberRoot = (fiber) => {
  let current = fiber;
  while (current.return) {
    current = current.return;
  }

  return current;
}

/**
 * @param {FiberNode} parentFiber
 * @param {Array<ReactElement|string>} nextChildElements
 * 
 * @returns {Array<Effects>}
 */
const reconcileChildrenArray = (parentFiber, nextChildElements) => {
  const effects = [];
  const nextElements = toArray(nextChildElements);

  let index = 0;
  let oldFiber = parentFiber.alternate ? parentFiber.alternate.child : null;
  let newFiber = null;

  // compare old fiber and next react element respectively to create new fiber
  while (index < nextElements.length || oldFiber != null) {
    const prevFiber = newFiber;
    const newElement = nextElements[index];

    newFiber = createFiberFromElement(newElement);

    if (newFiber) {
      newFiber.state = oldFiber && oldFiber.state;
      newFiber.stateNode = oldFiber && oldFiber.stateNode;
      newFiber.return = parentFiber;
      newFiber.alternate = oldFiber;
    }

    // collect effects
    effects.push(...resolveEffects(oldFiber, newFiber));

    // update child and sibling
    if (index === 0) {
      parentFiber.child = newFiber;
    } else if (prevFiber && newElement) {
      prevFiber.sibling = newFiber;
    }

    // move old fiber to next one
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // move new element to next one
    index++;
  };

  return effects;
};

const cloneChildrenFibers = (parentFiber) => {
  let oldFiber = parentFiber.alternate ? parentFiber.alternate.child : null;
  if (!oldFiber) {
    return;
  }

  let newFiber = null;
  while (oldFiber) {
    const prevFiber = newFiber;

    newFiber = Object.assign({}, oldFiber);
    newFiber.return = parentFiber;
    newFiber.alternate = oldFiber;

    if (!prevFiber) {
      parentFiber.child = newFiber;
    } else {
      prevFiber.sibling = newFiber;
    }

    oldFiber = oldFiber.sibling;
  }
};

const updatClassComponent = (fiber) => {
  let instance = fiber.stateNode;

  if (!instance) {
    instance = fiber.stateNode = new fiber.type(fiber.props);
  } else if (fiber.props === instance.props && !fiber.state) {
    // No need to render, clone children from last time
    return cloneChildrenFibers(fiber);
  }

  instance.props = fiber.props;
  instance.state = Object.assign({}, instance.state, fiber.state);
  fiber.state = null;

  const nextChildElements = instance.render();

  return reconcileChildrenArray(fiber, nextChildElements);
};

const updateFunctionComponent = () => {

};

const updateHostComponent = (fiber) => {
  if (!fiber.stateNode) {
    fiber.stateNode = createDOMElement(fiber);
  }

  const nextChildElements = fiber.props.children;

  return reconcileChildrenArray(fiber, nextChildElements);
};

const updateHostText = (fiber) => {
  if (!fiber.stateNode) {
    fiber.stateNode = createTextElement(fiber);
  }
}

const updater = {
  [FIBER_TAGS.ClassComponent]: updatClassComponent,
  [FIBER_TAGS.FunctionComponent]: updateFunctionComponent,
  [FIBER_TAGS.HostComponent]: updateHostComponent,
  [FIBER_TAGS.HostRoot]: updateHostComponent,
  [FIBER_TAGS.HostText]: updateHostText,
};

export const updateFiber = (fiber) => {
  const update = updater[fiber.tag];
  const effects = update && update(fiber);

  fiber.effects = effects || [];
};
