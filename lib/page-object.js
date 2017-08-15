'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const drivexBuilder = require('selenium-drivex');
const collections = require('./collections');
const descriptorBuilder = require('./descriptor');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

module.exports = function pageObject(nemo) {
  const drivex = drivexBuilder(nemo.driver, nemo.wd);
  const describeLocator = descriptorBuilder(nemo, drivex);

  /**
   * Creates a function that when called returns the text for the specified selector
   * @example
   * const getSampleText = text('text-selector');
   * const sampleText = await getSampleText();
   * @param {Object} nemo 
   * @param {Object} drivex 
   */
  function text(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionText())
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  function attribute(attributeName, locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionAttribute(attributeName))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called fills a given input element with the provided value
   * @example
   * const fillInput = fillable('input-css-selector');
   * await fillInput('Some awesome value!');
   * @param {Object} nemo 
   */
  function fillable(locator) {
    return (page, value, options) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.sendKeysToCollection(value))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    }
  }

  /**
   * Creates a function that when called performs a browser get operation
   * @example
   * const visit = visitable('http://site.com/path/to/page');
   * await visit(params);
   * @param {Object} nemo
   */
  function visitable(url) {
    return (page, params = {}, query) => {
      const urlWithParams = replaceParams(url, params);
      const queryString = query ? `?${querystring.stringify(query)}` : '';
  
      return nemo.driver
        .get(`${urlWithParams}${queryString}`);
    };
  }

  /**
   * Creates a function that when called returns an array of objects with the defined template
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
   * @param {Object} nemo 
   * @param {Object} drivex 
   */
  function collection(options) {
    return (page, index) => {
      const descriptor = describeLocator({
        locator: options.itemScope,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
      const fieldNames = Object.keys(options.item);
      
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

  return {
    text,
    fillable,
    visitable,
    collection,
    attribute,
  };
};