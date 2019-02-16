import { FIBER_TAGS } from './createFiber';

const DEFAUT_WORK_TIME = 1;
const updateQueue = [];
let nextUnitOfWork = null;

const scheduleWork = (work) => {
  requestIdleCallback(work);
}

const createNextUnitOfWork = () => {
  const update = updateQueue.unshift();
  if (!update) {
    return;
  }

  return {
    tag: FIBER_TAGS.HostRoot,
  }
};

const updatClassComponent = () => {

};

const updateFunctionComponent = () => {

};

const updateHostComponent = () => {

};

const beginWork = (fiber) => {
  switch (fiber.tag) {
    case FIBER_TAGS.ClassComponent:
      updatClassComponent();
      break;
    case FIBER_TAGS.FunctionComponent:
      updateFunctionComponent();
      break;
    case FIBER_TAGS.HostComponent:
      updateHostComponent();
      break;
  }
};

const completeWork = (fiber) => {

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

    current = current.parent;
  }
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
}

export const scheduleUpdate = (instance, paritalState) => {
  const update = {
    tag: FIBER_TAGS.ClassComponent,
    instance,
    paritalState,
  };

  updateQueue.push(update);

  scheduleWork(workLoop);
};
