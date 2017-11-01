'use strict';

const path = require('path');
const glob = require('glob');
const assert = require('assert');
const Promise = require('bluebird');
const isFunction = require('lodash/isFunction');
const pageObject = require('./lib/page-object');

const globAsync = Promise.promisify(glob, { multiArgs: true });
const PAGE_OBJECT_MODULES_GLOB = '**/*.js';

/**
 * 
 * Easily implement and use the Page Object pattern in your nemo based tests, by using a simple api,
 * mostly inspired by the [ember-cli-page-object](https://github.com/san650/ember-cli-page-object) ember addon, widely used in the ember ecosystem for functional and integration testing.
 * 
 * In your nemo configuration, with an absolute path specify where your page objects are.
 * @example
 * {
 *  "plugins": {
 *    "nemo-objects": {
 *      "module": "nemo-objects",
 *      "arguments": [
 *        {
 *           "pagesLocation": "/path/to/pages"
 *        }
 *      ]
 *    }
 *  }
 * }
 * @name nemoObjects
 * @param {Object} opts
 * @param {String} opts.pagesLocation Absolute path pointing to a valid directory
 * @param {Object} nemo
 * @param {Function} callback 
 */
function createPageObject(opts, nemo, callback) {
  if (arguments.length === 2) {
    nemo = opts;
    callback = nemo;
    opts = {};
  }

  return Promise.try(() => {
    assert(typeof opts.pagesLocation === 'string', 'A pages absolute path is required');

    return globAsync(PAGE_OBJECT_MODULES_GLOB, {
      cwd: opts.pagesLocation
    });
  })
  .then((moduleNames) => {
    const page = pageObject(nemo);

    nemo.objects = {};

    return moduleNames.forEach((moduleName) => {
      const modulePath = path.resolve(opts.pagesLocation, moduleName[0]);
      const moduleNameWithoutExt = path.basename(modulePath, path.extname(modulePath));
      const pageModule = require(modulePath);
      const model = pageModule(page, nemo);
      
      Object.keys(model).forEach((key) => {
        const method = model[key];
    
        if (isFunction(method)) {
          model[key] = method.bind(model, model);
        }
      });

      Object.assign(nemo.objects, {
        [moduleNameWithoutExt]: model,
      });
    });
  })
  .asCallback(callback);
};

module.exports = {
  setup: createPageObject,
};