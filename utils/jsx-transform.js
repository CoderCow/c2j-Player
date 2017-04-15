'use strict';

let h = require('virtual-dom/h');

// The transform-react-jsx Babel plugin produces objects which are not directly compatible with virtual-dom as
// it doesn't allow data-* and aria-* attributes provided as properties - so we have to do a simple pre-conversion
// of the objects transform-react-jsx generates.
// TODO: might reimplement this as a babel plugin later
module.exports = function(tagName, properties) {
  for (let propertyName in properties) {
    if (propertyName.startsWith('data-')) {
      properties.dataset = properties.dataset || {};
      properties.dataset[propertyName.substr(5)] = properties[propertyName];
    } else if (propertyName.startsWith('aria-')) {
      properties.attributes = properties.attributes || {};
      properties.attributes[propertyName] = properties[propertyName];
    }
  }

  let children = Array.prototype.slice.call(arguments, 2);

  return h(tagName, properties, children);
};
