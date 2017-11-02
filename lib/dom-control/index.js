'use strict';

const assert = require('assert');
const drivexBuilder = require('selenium-drivex');

module.exports = function domControl(webdriver) {
  const drivex = drivexBuilder(webdriver);
  const findsDefaults = {
    multiple: true,
  };

  const api = {
    async finds(locator, parentElement, opts = findsDefaults) {
      if (opts.multiple) {
        const elements = await drivex.finds(locator, parentElement);

        if (opts.at !== undefined) {
          if (opts.at < 0 || opts.at > elements.length) {
            throw new Error(`The specified index (${opts.at}) does not exists in the matching elements`);
          }

          return [elements[opts.at]];
        }

        return elements;
      }

      return await [drivex.find(locator, parentElement)];
    }
  };

  return Object.assign({}, drivex, api);
}