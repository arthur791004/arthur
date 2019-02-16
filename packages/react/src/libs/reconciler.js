import { FIBER_TAGS } from './createFiber';

const updateQueue = [];

const performWork = (dealine) => {

};

export const scheduleUpdate = (instance, paritalState) => {
  const update = {
    tag: FIBER_TAGS.ClassComponent,
    instance,
    paritalState,
  };

  updateQueue.push(update);

  requestIdleCallback(performWork);
};
