'use strict';

const collections = require('./../collections');
const descriptorBuilder = require('./../descriptor');

module.exports = function valueProperty(nemo, drivex) {
  const describeLocator = descriptorBuilder(nemo, drivex);

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
        .then(collections.getCollectionAttribute('value'))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }
}