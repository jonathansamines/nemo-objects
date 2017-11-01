'use strict';

const querystring = require('querystring');
const collections = require('./../collections');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

module.exports = function visitable(nemo, drivex) {

  /**
   * Creates a function that when called performs a browser get operation
   * @example
   * const visit = visitable('http://site.com/path/to/page');
   * await visit(params);
   * @param {String} url
   */
  return function visitable(url) {
    return (page, params = {}, query) => {
      const urlWithParams = replaceParams(url, params);
      const queryString = query ? `?${querystring.stringify(query)}` : '';
  
      return nemo.driver.get(`${urlWithParams}${queryString}`);
    };
  };
};