'use strict';

const collections = require('./../collections');

module.exports = function countProperty(nemo, drivex, descriptor) {

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
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(meta.locator, meta.parentElement)
        .then(collections.countCollection());
    };
  }
};