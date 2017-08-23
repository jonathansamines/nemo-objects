'use strict';

const collections = require('./../collections');
const descriptorBuilder = require('./../descriptor');

module.exports = function countProperty(nemo, drivex) {
  const describeLocator = descriptorBuilder(nemo, drivex);

  /**
   * Creates a function that when called counts the number of elements found with the specified locator
   * @example
   * const getNumberOfButtons = count('super-button');
   * const numberOfButtons = await getNumberOfButtons();
   * @param {Object} locator
   * @param {Object} options
   */
  return function count(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.countCollection());
    };
  }
};