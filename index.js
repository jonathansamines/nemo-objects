'use strict';

const pageObject = require('./lib/page-object');

/**
 * Creates the nemo plugin. It sets the page object utilities inside the nemo instance as:
 * nemo.page
 * @example
 * {
 *  "plugins": {
 *    "page-object": {
 *      "module": "nemo-page-object",
 *      "arguments": [
 *        {
 *           "pagesLocation": "/path/to/pages"
 *        }
 *      ]
 *    }
 *  }
 * }
 * 
 * @param {Object} opts 
 * @param {Object} nemo 
 * @param {Function} callback 
 */
function createPageObject(opts, nemo, callback) {
  if (arguments.length === 2) {
    nemo = opts;
    callback = nemo;
    opts = {};
  }

  const pageModel = require('./test/pages/countryLanding');
  const instance = pageObject(nemo, pageModel);

  // TODO: Load page objects based on the provided path
  nemo.page = {
    countryLanding: instance,
  };

  callback();
};

module.exports = {
  setup: createPageObject,
};