const jsdom = require('jsdom');
const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

const { JSDOM } = jsdom;

const { document: doc } = (new JSDOM('<!doctype html><html><body></body></html>')).window;

const win = doc.defaultView;

global.document = doc;
global.window = win;

console.error = message => {
  if (!/(React.createElement: type should not be null)/.test(message)) {
    throw new Error(message);
  }
};
