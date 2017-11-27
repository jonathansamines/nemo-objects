'use strict';

module.exports = function fillableProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called fills a given input element with the provided value
   * @example
   * const fillInput = fillable('input-css-selector');
   * await fillInput('Some awesome value!');
   * @param {Object} locator
   * @param {Object} options
   * @param {Object} options.scope Nest the provided scope with the parent's scope
   * @param {Boolean} options.resetScope Indicates if the parent's scope should be overriden
   * @param {Number} options.at Returns the element's value at the specified position
   */
  return function fillable(locator, options = {}) {
    return async (page, value) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      const elements = await control.finds(meta.locator, meta.parentElement);

      await Promise.all(elements.map((el) => el.sendKeys(value)));
    };
  };
}