const REACT_ELEMENT_TYPE = Symbol.for('react.element');

const ReactElement = (type, props) => ({
  // This tag allows us to uniquely identify this as a React Element
  $$typeof: REACT_ELEMENT_TYPE,
  ref: null,

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
