
const REACT_PROPS = ['children', 'style'];
const isChanged = (key, prevProps = {}, nextProps = {}) =>
  prevProps[key] !== nextProps[key];
const isEvent = name => name.startsWith('on');
const isAttribute = name =>
  !(isEvent(name) || REACT_PROPS.includes(name));

export const updateDOMProps = ($element, prevProps, nextProps) => {
  const mergedProps = Object.assign({}, prevProps, nextProps);

  // update attributes
  Object.keys(mergedProps)
    .filter(isAttribute)
    .filter(key => isChanged(key, prevProps, nextProps))
    .forEach((key) => {
      $element[key] = nextProps.hasOwnProperty(key) ?
        nextProps[key] :
        null;
    });

  // update style
  Object.keys(mergedProps.style || {})
    .filter(key => isChanged(key, prevProps.style, nextProps.style))
    .forEach((key) => {
      $element.style[key] = nextProps.style.hasOwnProperty(key) ?
        nextProps.style[key] :
        '';
    })

  // update event listeners
  Object.keys(mergedProps)
    .filter(isEvent)
    .filter(key => isChanged(key, prevProps, nextProps))
    .forEach((eventName) => {
      const eventType = eventName.toLowerCase().substring(2);

      if (!nextProps.hasOwnProperty(eventName)) {
        $element.removeEventListener(eventType, prevProps[eventName]);
      } else {
        $element.addEventListener(eventType, nextProps[eventName]);
      }
    });
};

export const createDOMElement = (fiber) => {
  const $element = document.createElement(fiber.type);

  updateDOMProps($element, {}, fiber.props);

  return $element;
};

export const createTextElement = (fiber) => {
  const $element = document.createTextNode('');

  updateDOMProps($element, {}, fiber.props);

  return $element;
}