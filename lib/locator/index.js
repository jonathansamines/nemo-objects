'use strict';

const normalize = require('./normalize');

module.exports = function locator(nemo, control) {

  /**
   * Creates a descriptor which defines from which root the provided locator will be looked up
   * as well as normalizing the provided locator
   * 
   * @param {Object} options
   * @param {Object} options.locator Any valid locator definition
   * @param {Object} options.scope Any valid locator definition for the immediate locator parent
   * @param {Object} options.pageScope Any valid locator definition for the locator page
   * @param {Object} options.resetScope Whether or not the page scope should be taken into consideration when looking for the locator
   * @private
   */
  function describe({ locator, scope, pageScope, resetScope }) {
    const normalizedLocator = normalize(nemo, locator);

    // if pageScope is present we use it only if resetScope was not provided
    const optionalPageElement = (
      (!resetScope && pageScope) &&
      control.find(normalize(nemo, pageScope))
    );

    const parentElement = (
      scope ?
      control.find(normalize(nemo, scope), optionalPageElement) :
      optionalPageElement
    );
  
    return {
      locator: normalizedLocator,
      parentElement,
    };
  };

  return {
    describe,
  };
};