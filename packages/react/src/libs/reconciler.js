import {
  FIBER_TAGS,
  EFFECT_TAGS,
  isRealDOM,
  createFiber,
  getFiberFromInstance,
  setFiberToInstance,
  getFiberRoot,
  updateFiber
} from './fiber';
import { updateDOMProps } from './dom';

const DEFAUT_WORK_TIME = 1;
const updateQueue = [];
let nextUnitOfWork = null;
let pendingCommit = null;

const scheduleWork = (work) => {
  requestIdleCallback(work);
}

/**
 * @returns {FiberNode} root fiber of workingInProgress tree
 */
const createNextUnitOfWork = () => {
  const update = updateQueue.shift();
  if (!update) {
    return;
  }

  const { fiber, pendingProps, pendingState } = update;
  const root = getFiberRoot(fiber);

  // set next state to the target fiber
  fiber.state = pendingState;

  return {
    tag: FIBER_TAGS.HostRoot,
    props: pendingProps || root.props,
    stateNode: root.stateNode,
    alternate: root,
  }
};

const beginWork = (fiber) => {
  updateFiber(fiber);
};

const completeWork = (fiber) => {
  setFiberToInstance(fiber.stateNode, fiber);

  if (!fiber.return) {
    pendingCommit = fiber;
  } else {
    const childEffects = fiber.effects;
    const parentEffects = fiber.return.effects || [];
  
    fiber.return.effects = parentEffects.concat(childEffects);
  }
};

/**
 * begin work of fiber and complete if all of the children are completed
 * @returns {Fiber} the next fiber need to be perform
 */
const performUnitOfWork = (fiber) => {
  beginWork(fiber);

  if (fiber.child) {
    return fiber.child;
  }

  let current = fiber;
  while (current) {
    completeWork(current);

    if (current.sibling) {
      return current.sibling;
    }

    current = current.return;
  }
};

const commitWork = (fiber) => {
  if (!isRealDOM(fiber.tag)) {
    return;
  }

  let parentFiber = fiber.return;
  while (!isRealDOM(parentFiber.tag)) {
    parentFiber = parentFiber.return;
  }

  const $parent = parentFiber.stateNode;
  switch (fiber.effectTag) {
    case EFFECT_TAGS.Placement:
      $parent.appendChild(fiber.stateNode);
      break;
    case EFFECT_TAGS.Update:
      updateDOMProps(fiber.stateNode, fiber.alternate.props, fiber.props);
      break;
    case EFFECT_TAGS.Deletion:
      break;
  }
};

const commitAllWork = (fiber) => {
  fiber.effects.forEach(effect => commitWork(effect))

  nextUnitOfWork = null;
  pendingCommit = null;
};

const workLoop = (deadline) => {
  // if execute at the begin of update, create root of workInProgress
  // fiber tree for nextUnitOfWork
  if (!nextUnitOfWork) {
    nextUnitOfWork = createNextUnitOfWork();
  }

  const hasEnoughTime = deadline.timeRemaining() > DEFAUT_WORK_TIME;
  while (nextUnitOfWork && hasEnoughTime) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // if current update doesn't finish or still have pending updates
  // schedule next work
  if (nextUnitOfWork || updateQueue.length > 0) {
    scheduleWork(workLoop);
  }

  if (pendingCommit) {
    commitAllWork(pendingCommit);
  }
}

export const scheduleRender = (element, $container) => {
  const fiber = getFiberFromInstance($container) ||
    createFiber(FIBER_TAGS.HostRoot, $container);
  const update = {
    fiber,
    pendingProps: {
      children: element,
    }
  };

  updateQueue.push(update);

  scheduleWork(workLoop);
}

export const scheduleUpdate = (instance, partialState) => {
  const fiber = getFiberFromInstance(instance) ||
    createFiber(FIBER_TAGS.ClassComponent, instance);
  const update = {
    fiber,
    pendingState: partialState || {},
  };

  updateQueue.push(update);

  scheduleWork(workLoop);
};
