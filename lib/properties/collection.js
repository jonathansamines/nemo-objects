'use strict';

const Promise = require('bluebird');
const collections = require('./../collections');

module.exports = function collectionProperty(nemo, drivex, descriptor) {

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
      const meta = descriptor.describe({
        locator: options.itemScope,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
      
      return drivex
        .finds(meta.locator, meta.parentElement)
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