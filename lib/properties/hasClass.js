'use strict';

const Promise = require('bluebird');

module.exports = function hasClassProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called determines if element found with the provided
   * locator has the specified CSS class
   * @example
   * const isButtonActive = hasClass('.active', 'super-button');
   * const buttonIsActive = await isButtonActive();
   * @param {String} cssClass
   * @param {Object} locator
   * @param {Object} options
   */
  return function hasClass(cssClass, locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      const elements = await control.finds(meta.locator, meta.parentElement, options);
      const elementsHasCSSClass = await Promise.map(elements, async (el) => {
        const className = await el.getAttribute('class');

        return className.split(' ').includes(cssClass);
      });

      return elementsHasCSSClass.every((hasClassName) => hasClassName);
    };
  };
}