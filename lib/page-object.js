'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const drivexBuilder = require('selenium-drivex');
const collections = require('./collections');
const descriptorBuilder = require('./descriptor');

function replaceParams(url, params) {
  return Object
    .keys(params)
    .reduce((uri, paramName) => {
      return uri.replace(/:(a-zA-Z0-9)+/, params[paramName]);
    }, url);
}

module.exports = function pageObject(nemo) {
  const drivex = drivexBuilder(nemo.driver, nemo.wd);
  const describeLocator = descriptorBuilder(nemo, drivex);

  /**
   * Creates a function that when called returns the text for the specified selector
   * @example
   * const getSampleText = text('text-selector');
   * const sampleText = await getSampleText();
   * @param {Object} locator
   * @param {Object} options
   */
  function text(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionText())
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called returns the attribute value for the specified selector
   * @example
   * const getInputValue = attribute('value', 'input-selector');
   * const inputValue = await getInputValue();
   * @param {String} attributeName Name of the attribute to get the value from
   * @param {Object} locator
   * @param {Object} options
   */
  function attribute(attributeName, locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionAttribute(attributeName))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called returns the value for the specifie form element
   * @example
   * const getInputValue = value('input-selector');
   * const inputValue = await getInputValue();
   * @param {Object} locator
   * @param {Object} options
   */
  function value(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionAttribute('value'))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called fills a given input element with the provided value
   * @example
   * const fillInput = fillable('input-css-selector');
   * await fillInput('Some awesome value!');
   * @param {Object} locator
   * @param {Object} options
   */
  function fillable(locator, options = {}) {
    return (page, value) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.sendKeysToCollection(value))
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called clicks on the specified element
   * @example
   * const useSupperButton = clickable('super-button');
   * await useSupperButton();
   * @param {Object} locator
   * @param {Object} options
   */
  function clickable(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.clickOnCollection())
        .then(collections.getItemAtCollectionIndex(options.multiple, options.at));
    };
  }

  /**
   * Creates a function that when called counts the number of elements found with the specified locator
   * @example
   * const getNumberOfButtons = count('super-button');
   * const numberOfButtons = await getNumberOfButtons();
   * @param {Object} locator
   * @param {Object} options
   */
  function count(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });

      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.countCollection());
    };
  }

  /**
   * Creates a function that when called determines if element found with the provided
   * locator has the specified CSS class
   * @example
   * const isButtonActive = hasClass('.active', 'super-button');
   * const buttonIsActive = await isButtonActive();
   * @param {String} cssClass
   * @param {Object} locator
   * @param {Object} options
   */
  function hasClass(cssClass, locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionAttribute('class'))
        .then((classNames) => {
          return classNames.every((className) => {
            return className.split(' ').includes(cssClass);
          });
        });
    };
  }

  /**
   * Creates a function that when called determines if the element found with the provided
   * locator is visible
   * @example
   * const isSubmitEnabled = isVisible('super-button');
   * const isSuperButtonVisible = await isSubmitEnabled();
   * @param {Object} locator
   * @param {Object} options
   */
  function isVisible(locator, options = {}) {
    return (page) => {
      const descriptor = describeLocator({
        locator,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
  
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then(collections.singleOrMultipleAsCollection(options.multiple, options.at))
        .then(collections.getCollectionIsDisplayed())
        .then((displayCollection) => {
          return displayCollection.every((isDisplayed) => isDisplayed);
        });
    };
  }

  /**
   * Creates a function that when called performs a browser get operation
   * @example
   * const visit = visitable('http://site.com/path/to/page');
   * await visit(params);
   * @param {String} url
   */
  function visitable(url) {
    return (page, params = {}, query) => {
      const urlWithParams = replaceParams(url, params);
      const queryString = query ? `?${querystring.stringify(query)}` : '';
  
      return nemo.driver
        .get(`${urlWithParams}${queryString}`);
    };
  }

  /**
   * Creates a function that when called returns an array of objects
   * with the defined item template
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
   * @param {Object} options
   */
  function collection(options = {}) {
    const fieldNames = Object.keys(options.item);

    return (page, index) => {
      const descriptor = describeLocator({
        locator: options.itemScope,
        scope: options.scope,
        pageScope: page.scope,
        resetScope: options.resetScope,
      });
      
      return drivex
        .finds(descriptor.locator, descriptor.parentElement)
        .then((elements) => {
          return Promise.map(elements, (element) => {
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

  return {
    text,
    fillable,
    visitable,
    collection,
    attribute,
    count,
    hasClass,
    isVisible,
    value,
  };
};