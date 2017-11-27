'use strict';

const drivexBuilder = require('selenium-drivex');

const findsDefaults = {
  multiple: true,
};

module.exports = function domControl(webdriver) {
  const drivex = drivexBuilder(webdriver);

  async function finds(locator, parentElement, opts = findsDefaults) {
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

    return [await drivex.find(locator, parentElement)];
  }

  const domControlAPI = {
    finds,
  };

  return Object.assign({}, drivex, domControlAPI);
};
