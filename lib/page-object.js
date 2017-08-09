'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const drivexBuilder = require('selenium-drivex');
const normalize = require('./normalize');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

/**
 * Creates a function that when called performs a browser get operation
 * @example
 * const visit = visitable('http://site.com/path/to/page');
 * await visit(params);
 * @param {Object} nemo
 */
function visitable(nemo) {
  return (url) => (params = {}, query) => {
    const urlWithParams = replaceParams(url, params);
    const queryString = query ? `?${querystring.stringify(query)}` : '';

    return nemo.driver
      .get(`${urlWithParams}${queryString}`);
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
  return (locator) => (value, options) => {
    return drivex
      .find(normalize(nemo, locator))
      .sendKeys(value);
  };
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
  return (locator, options = {}) => (scope) => {
    return drivex
      .find(
        normalize(nemo, locator),
        scope || drivex.find(normalize(nemo, locator))
      )
      .getText();
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
  return (options) => (index) => {
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
}

function form() {}

module.exports = function pageObject(nemo) {
  const drivex = drivexBuilder(nemo.driver, nemo.wd);

  return {
    text: text(nemo, drivex),
    fillable: fillable(nemo, drivex),
    visitable: visitable(nemo, drivex),
    collection: collection(nemo, drivex),
  };
};