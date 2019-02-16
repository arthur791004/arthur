const ReactElement = (type, props) => ({
  type,
  props,
})

/**
 * @param {Function|Class|NodeName} type
 * @param {Object} props
 * @param {Array<ReactElement|string>} children
 *
 * @return {ReactElement}
 */
const createElement = (type, config, ...children) => {
  const props = Object.assign({}, props, { children });

  return ReactElement(type, props);
};

export default createElement;
