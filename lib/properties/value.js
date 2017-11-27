'use strict';

const { getElementAt } = require('./../collections');

module.exports = function valueProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called returns the value for the specifie form element
   * @example
   * const getInputValue = value('.input-selector');
   * const inputValue = await getInputValue();
   * @param {Object} locator
   * @param {Object} options
   * @param {Object} options.scope Nest the provided scope with the parent's scope
   * @param {Boolean} options.resetScope Indicates if the parent's scope should be overriden
   * @param {Boolean} options.multiple Indicates if the function should return an array of element's values
   * @param {Number} options.at When multiple is true, returns the element's value at the specified position
   */
  return function value(locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      const elements = await control.finds(meta.locator, meta.parentElement, options);
      const elementsValue = await Promise.all(elements.map((el) => el.getAttribute('value')));

      return getElementAt(elementsValue, options.multiple, options.at);
    };
  }
}