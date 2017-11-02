'use strict';

const Promise = require('bluebird');

module.exports = function clickableProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called clicks on the specified element
   * @example
   * const useSupperButton = clickable('super-button');
   * await useSupperButton();
   * @param {Object} locator
   * @param {Object} options
   * @param {Object} options.scope Nest the provided scope with the parent's scope
   * @param {Boolean} options.resetScope Indicates if the parent's scope should be overriden
   * @param {Number} options.at When multiple is true, returns the element's value at the specified position
   */
  return function clickable(locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      const elements = await control.finds(meta.locator, meta.parentElement);
      await Promise.map(elements, (el) => el.click());
    };
  };
};