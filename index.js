'use strict';

const path = require('path');
const glob = require('glob');
const assert = require('assert');
const util = require('util');
const isFunction = require('lodash/isFunction');
const pageObject = require('./lib/page-object');

const globAsync = util.promisify(glob);

const getPageModuleNames = async (cwd) => {
  return await globAsync('**/*.js', { cwd });
};

const getPageModule = (pagesLocation, moduleName) => {
  const modulePath = path.resolve(pagesLocation, moduleName);
  const pageObjectName = path.basename(modulePath, path.extname(modulePath));
  const pageModule = require(modulePath);

  return {
    pageObjectName,
    pageModule,
  };
};

const initModuleAsync = async (nemo, { pagesLocation }) => {
  assert(typeof pagesLocation === 'string', 'A pages absolute path is required');

  const page = pageObject(nemo);
  const moduleNames = await getPageModuleNames(pagesLocation);

  nemo.objects = {};

  return moduleNames.forEach((moduleName) => {
    const { pageObjectName, pageModule} = getPageModule(pagesLocation, moduleName);

    if (!isFunction(pageModule)) {
      throw new Error('The page object module was expected to be a factory function');
    }

    const model = pageModule(page, nemo);
    
    Object.keys(model).forEach((key) => {
      const method = model[key];
  
      if (isFunction(method)) {
        model[key] = method.bind(model, model);
      }
    });

    Object.assign(nemo.objects, {
      [pageObjectName]: model,
    });
  });
};

const init = util.callbackify(initModuleAsync);

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

  return init(nemo, opts, callback);
};

module.exports = {
  setup: createPageObject,
};