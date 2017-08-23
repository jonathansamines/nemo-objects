'use strict';

/**
 *
 * @param {String} locatorString defining a WebElement locator as defined in this module's README
 * @returns Object {{type: *, locator: *}}
 * @private
 */
function _splitLocator(nemo, locatorString) {
  let strategy = locatorString.substr(0, locatorString.indexOf(':'));
  let locator = '';

  if (strategy.length > 0 && nemo.wd.By[strategy] !== undefined) {
    locator = locatorString.substr(locatorString.indexOf(':') + 1, locatorString.length);
  } else {
    strategy = 'css';
    locator = locatorString;
  }

  return {
    type: strategy,
    locator: locator
  };
};

/**
 * normalizes either string or object locator definition to a selenium Locator object
 * @param nemo
 * @param {String or Object} _locator
 * @returns Locator
 * @private
 */
module.exports = function normalize(nemo, _locator) {
  let locator = _locator;

  if (_locator.constructor === String) {
    locator = _splitLocator(nemo, _locator);
  }

  const normalizedLocator = nemo.wd.By[locator.type](locator.locator);

  return normalizedLocator;
};