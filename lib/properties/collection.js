'use strict';

const { getElementAt } = require('./../collections');

const promiseProps = async (props) => {
  const keys = Object.keys(props);
  const values = await Promise.all(keys.map((key) => props[key]));
  
  return keys.reduce((acc, key, index) => {
    return Object.assign(acc, {
      [key] : values[index],
    });
  }, {});
};

function getItemModel(item) {
  const fieldNames = Object.keys(item);

  return (element) => {
    const model = fieldNames.reduce((props, fieldName) => {
      const field = item[fieldName];
  
      return Object.assign(props, {
        [fieldName]: field(element),
      });
    }, {});
  
    return promiseProps(model);
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
      const elementsModel = await Promise.all(elements.map(getItemModel(options.item)));

      return elementsModel;
    };
  }
};