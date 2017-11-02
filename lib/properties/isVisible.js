'use strict';

const Promise = require('bluebird');

module.exports = function isVisible(nemo, control, descriptor) {

  /**
   * Creates a function that when called determines if the element found with the provided
   * locator is visible
   * @example
   * const isSubmitEnabled = isVisible('super-button');
   * const isSuperButtonVisible = await isSubmitEnabled();
   * @param {Object} locator
   * @param {Object} options
   */
  return function isVisible(locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      const elements = await control.finds(meta.locator, meta.parentElement);
      const areElementsVisible = await Promise.map(elements, (el) => el.isDisplayed());
  
      return areElementsVisible.every((isDisplayed) => isDisplayed)
    };
  }
};