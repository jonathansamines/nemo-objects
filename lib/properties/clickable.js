'use strict';

const collections = require('./../collections');
const descriptorBuilder = require('./../descriptor');

module.exports = function clickableProperty(nemo, drivex) {
  const describeLocator = descriptorBuilder(nemo, drivex);

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
        .then(collections.clickOnCollection())
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  };
};