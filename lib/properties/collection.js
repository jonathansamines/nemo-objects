'use strict';

const Promise = require('bluebird');
const collections = require('./../collections');
const descriptorBuilder = require('./../descriptor');

module.exports = function collectionProperty(nemo, drivex) {
  const describeLocator = descriptorBuilder(nemo, drivex);

  /**
   * Creates a function that when called returns an array of objects
   * with the defined item template
   * 
   * @example
   * const getElementList = collection({
   *  itemScope: 'root-to-list',
   *  item: {
   *    field: text('input-selector')
   *  }
   * });
   * 
   * const item = await getElementList(index);
   * @param {Object} options
   */
  return function collection(options = {}) {
    const fieldNames = Object.keys(options.item);

    return (page, index) => {
      const descriptor = describeLocator({
        locator: options.itemScope,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
      
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then((elements) => {
          return Promise.map(elements, (element) => {
            const item = fieldNames.reduce((props, fieldName) => {
              const field = options.item[fieldName];
    
              return Object.assign(props, {
                [fieldName]: field(element),
              });
            }, {});
    
            return Promise.props(item);
          });
      });
    };
  }
};