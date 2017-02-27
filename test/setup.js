const jsdom = require('jsdom');

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');

const win = doc.defaultView;

global.document = doc;
global.window = win;

function propagateToGlobal(window) {
  Object.keys(window).forEach((key) => {
    if (!global.hasOwnProperty(key)) {
      global[key] = window[key];
    }
  });
}

propagateToGlobal(win);

console.error = message => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};
