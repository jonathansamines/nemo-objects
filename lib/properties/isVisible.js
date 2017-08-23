'use strict';

const collections = require('./../collections');

module.exports = function isVisible(nemo, drivex, descriptor) {

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
        .then(collections.getCollectionIsDisplayed())
        .then((displayCollection) => {
          return displayCollection.every((isDisplayed) => isDisplayed);
        });
    };
  }
};