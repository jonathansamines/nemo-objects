'use strict';

const collections = require('./../collections');
const descriptorBuilder = require('./../descriptor');

module.exports = function hasClassProperty(nemo, drivex) {
  const describeLocator = descriptorBuilder(nemo, drivex);

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
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
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