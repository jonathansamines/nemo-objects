'use strict';

const Promise = require('bluebird');
const { getElementAt } = require('./../collections');

function getItemModel(item) {
  const fieldNames = Object.keys(item);

  return (element) => {
    const model = fieldNames.reduce((props, fieldName) => {
      const field = item[fieldName];
  
      return Object.assign(props, {
        [fieldName]: field(element),
      });
    }, {});
  
    return Promise.props(model);
  };
}

module.exports = function collectionProperty(nemo, control, descriptor) {

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
    return async (page, index) => {
      const meta = descriptor.describe({
        locator: options.itemScope,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
      
      const elements = await control.finds(meta.locator, meta.parentElement);
      const elementsModel = await Promise.map(elements, getItemModel(options.item));

      return elementsModel;
    };
  }
};