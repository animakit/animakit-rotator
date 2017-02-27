import isEqual from 'lodash.isequal';

/*
 * Check whether the CSS property supported
 */
function isPropertySupported(name, value) {
  const propName = name;

  const element = document.createElement('p');
  document.body.insertBefore(element, null);

  element.style[propName] = value;

  const propValue = window
    .getComputedStyle(element, null)
    .getPropertyValue(propName);

  document.body.removeChild(element);

  return propValue === value;
}

/*
 * Check whether the CSS 3D properties supported
 */
function is3DSupported() {
  return isPropertySupported('perspective', '1px') &&
         isPropertySupported('transform-style', 'preserve-3d');
}

/*
 * Get CSS transitionend event name
 */
function transitionEventName() {
  if (isPropertySupported('transition', 'opacity 1s')) {
    return 'transitionend';
  }

  return 'webkitTransitionEnd';
}

/*
 * Get neighbor numbers
 */
function getNeighbors(num, max) {
  let neighbor1 = num - 1;
  let neighbor2 = num + 1;

  if (neighbor1 < 0) neighbor1 = max;
  if (neighbor2 > max) neighbor2 = 0;

  return [neighbor1, neighbor2];
}

export {
  isEqual,
  is3DSupported,
  transitionEventName,
  getNeighbors,
};
