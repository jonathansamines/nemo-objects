'use strict';

const normalize = require('./normalize');

module.exports = function descriptorBuilder(nemo, drivex) {

  /**
   * Creates a descriptor which defines from which root the provided locator will be looked up
   * as well as normalizing the provided locator
   * 
   * @argument {Object} options
   * @argument {Object} options.locator Any valid locator definition
   * @argument {Object} options.scope Any valid locator definition for the immediate locator parent
   * @argument {Object} options.pageScope Any valid locator definition for the locator page
   * @argument {Object} options.resetScope Whether or not the page scope should be taken into consideration when looking for the locator
   */
  return (options) => {
    const locator = normalize(nemo, options.locator);
    const optionalPageElement = (
      (!options.resetScope && options.pageScope) &&
      drivex.find(normalize(nemo, options.pageScope))
    );
  
    const parentElement = (
      options.scope &&
      drivex.find(normalize(nemo, options.scope), optionalPageElement)
    );
  
    return {
      locator,
      parentElement,
    };
  };
};