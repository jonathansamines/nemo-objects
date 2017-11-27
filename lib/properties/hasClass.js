'use strict';

const elementHasCSSClass = cssClass => async (el) => {
  const className = await el.getAttribute('class');

  return className.split(' ').includes(cssClass);
};

function hasClassProperty(nemo, control, descriptor) {
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
      const elementsHaveCSSClass = await Promise.all(elements.map(elementHasCSSClass(cssClass)));

      return elementsHaveCSSClass.every(hasClassName => hasClassName);
    };
  };
}

module.exports = hasClassProperty;
