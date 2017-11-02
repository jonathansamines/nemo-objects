'use strict';

const querystring = require('querystring');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

module.exports = function visitable(nemo) {

  /**
   * Creates a function that when called performs a browser get operation
   * @example
   * const visit = visitable('http://site.com/path/to/page');
   * await visit(opts);
   * @param {String} url An absolute or relative URL resolvable by the current browser location
   * @param {Object} opts
   * @param {Object} opts.query Query params to append to the base url
   * @param {Object} opts.params Path params to replace on the base url
   */
  return function visitable(url) {
    return (page, { params, query } = {}) => {
      const urlWithParams = params ? replaceParams(url, params) : url;
      const queryString = query ? `?${querystring.stringify(query)}` : '';
  
      return nemo.driver.get(`${urlWithParams}${queryString}`);
    };
  };
};