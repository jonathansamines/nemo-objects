'use strict';

const Promise = require('bluebird');
const { getElementAt } = require('./../collections');

module.exports = function textProperty(nemo, control, descriptor) {

  /**
   * Creates a function that when called returns the text for the specified selector
   * @example
   * const getSampleText = text('.text-element');
   * const sampleText = await getSampleText();
   * @param {Object} locator
   * @param {Object} options
   * @param {Object} options.scope Nest the provided scope with the parent's scope
   * @param {Boolean} options.resetScope Indicates if the parent's scope should be overriden
   * @param {Boolean} options.multiple Indicates if the function should return an array of element's text
   * @param {Number} options.at When multiple is true, returns the element's text at the specified position
   */
  return function text(locator, options = {}) {
    return async (page) => {
      const meta = descriptor.describe({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      const elements = await control.finds(meta.locator, meta.parentElement, options);
      const elementsText = await Promise.map(elements, (el) => el.getText());

      return getElementAt(elementsText, options.multiple, options.at);
    };
  };
}