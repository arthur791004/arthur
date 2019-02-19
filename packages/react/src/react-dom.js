import { scheduleRender } from './libs/reconciler';

/**
 * @param {ReactElement} element
 * @param {Object} $container
 */
const render = (element, $container) => {
  scheduleRender(element, $container);
};

const ReactDOM = {
  render,
}

export default ReactDOM;
