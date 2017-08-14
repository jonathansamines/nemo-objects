'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const drivexBuilder = require('selenium-drivex');
const isFunction = require('lodash/isFunction');
const normalize = require('./normalize');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

function applyToCollection(method) {
  return (...args) => (collection) => {
    return Promise.map(collection, (item) => item[method](...args));
  };
}

const getCollectionText = applyToCollection('getText');
const getCollectionAttribute = applyToCollection('getAttribute');
const createLocatorConfig = (nemo, drivex, options, locator, page) => {
  const normalizedLocator = normalize(nemo, locator);
  const parentLocator = (!options.resetScope && page.scope) && drivex.find(normalize(nemo, page.scope));
  const useLocator = options.scope && drivex.find(normalize(nemo, options.scope), parentLocator);

  return {
    locator: normalizedLocator,
    useLocator,
  };
};

function getItemAtCollectionIndex(multiple, at) {
  return (collection) => {
    let index = at;

    if (!multiple) {
      index = 0;
    }

    return index !== undefined ? collection[index] : collection;
  }
}

/**
 * Creates a function that when called returns the text for the specified selector
 * @example
 * const getSampleText = text('text-selector');
 * const sampleText = await getSampleText();
 * @param {Object} nemo 
 * @param {Object} drivex 
 */
function text(nemo, drivex) {
  return function getText(locator, options = {}) {
    return (page) => {
      const config = createLocatorConfig(nemo, drivex, options, locator, page);
  
      return drivex
        .finds(config.locator, config.useLocator)
        .then(getCollectionText())
        .then(getItemAtCollectionIndex(options.multiple, options.at));
    };
  };
}

function attribute(nemo, drivex) {
  return function getAttribute(attributeName, locator, options = {}) {
    return (page) => {
      const config = createLocatorConfig(nemo, drivex, options, locator, page);
  
      return drivex
        .finds(config.locator, config.useLocator)
        .then(getCollectionAttribute(attributeName))
        .then(getItemAtCollectionIndex(options.multiple, options.at));
    };
  };
}

/**
 * Creates a function that when called performs a browser get operation
 * @example
 * const visit = visitable('http://site.com/path/to/page');
 * await visit(params);
 * @param {Object} nemo
 */
function visitable(nemo) {
  return function visit(url) {
    return (page, params = {}, query) => {
      const urlWithParams = replaceParams(url, params);
      const queryString = query ? `?${querystring.stringify(query)}` : '';
  
      return nemo.driver
        .get(`${urlWithParams}${queryString}`);
    };
  };
}

/**
 * Creates a function that when called fills a given input element with the provided value
 * @example
 * const fillInput = fillable('input-css-selector');
 * await fillInput('Some awesome value!');
 * @param {Object} nemo 
 */
function fillable(nemo, drivex) {
  return function fill(locator) {
    return (page, value, options) => {
      return drivex
        .find(normalize(nemo, locator))
        .sendKeys(value);
    }
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
function collection(nemo, drivex) {
  return function createCollection(options) {
    return (page, index) => {
      return drivex.finds(
        normalize(nemo, options.itemScope),
        drivex.find(normalize(nemo, options.scope))
      )
      .then((elements) => {
        return Promise.map(elements, (element) => {
          const fieldNames = Object.keys(options.item);
  
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
  };
}

module.exports = function pageObject(nemo, pageModel) {
  const drivex = drivexBuilder(nemo.driver, nemo.wd);
  const page = {
    text: text(nemo, drivex),
    fillable: fillable(nemo, drivex),
    visitable: visitable(nemo, drivex),
    collection: collection(nemo, drivex),
    attribute: attribute(nemo, drivex),
  };

  const instance = pageModel(page, nemo);

  Object.keys(instance).forEach((key) => {
    const method = instance[key];

    if (isFunction(method)) {
      instance[key] = method.bind(instance, instance);
    }
  });

  return instance;
};