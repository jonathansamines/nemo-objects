'use strict';

const collections = require('./../collections');

module.exports = function fillableProperty(nemo, drivex, descriptor) {

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
    return (page, value) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(meta.locator, meta.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.sendKeysToCollection(value))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  };
}