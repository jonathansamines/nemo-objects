'use strict';

const { getElementAt } = require('./../collections');

function attributeProperty(nemo, control, descriptor) {
  /**
   * Creates a function that when called returns the attribute value for the specified selector
   * @example
   * const getInputValue = attribute('value', '.input-selector');
   * const inputValue = await getInputValue();
   * @param {String} attributeName Name of the attribute to get the value from
   * @param {Object} locator
   * @param {Object} options
   * @param {Object} options.scope Nest the provided scope with the parent's scope
   * @param {Boolean} options.resetScope Indicates if the parent's scope should be overriden
   * @param {Boolean} options.multiple Indicates if the function should return an array of element's attributes
   * @param {Number} options.at When multiple is true, returns the element attribute's value at the specified position
   */
  return function attribute(attributeName, locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      const elements = await control.finds(meta.locator, meta.parentElement, options);
      const attributes = await Promise.all(elements.map(el => el.getAttribute(attributeName)));

      return getElementAt(attributes, options.multiple, options.at);
    };
  };
}

module.exports = attributeProperty;
