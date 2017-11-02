'use strict';

module.exports = function countProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called counts the number of elements found with the specified locator
   * @example
   * const getNumberOfButtons = count('super-button');
   * const numberOfButtons = await getNumberOfButtons();
   * @param {Object} locator
   * @param {Object} options
   */
  return function count(locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      const elements = await control.finds(meta.locator, meta.parentElement);

      return elements.length;
    };
  }
};