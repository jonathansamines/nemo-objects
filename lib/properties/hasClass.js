'use strict';

const collections = require('./../collections');

module.exports = function hasClassProperty(nemo, drivex, descriptor) {

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
    return (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(meta.locator, meta.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionAttribute('class'))
        .then((classNames) => {
          return classNames.every((className) => {
            return className.split(' ').includes(cssClass);
          });
        });
    };
  };
}