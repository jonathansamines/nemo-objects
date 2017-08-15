'use strict';

const Promise = require('bluebird');

function applyMethodToCollection(method) {
  return (...args) => (collection) => {
    return Promise.map(collection, (item) => item[method](...args));
  };
}

const getCollectionText = applyMethodToCollection('getText');
const getCollectionAttribute = applyMethodToCollection('getAttribute');
const sendKeysToCollection = applyMethodToCollection('sendKeys');

function singleOrMultipleAsCollection(multiple, at) {
  return (collection) => {
    let index = at;

    if (!multiple) {
      index = 0;
    }

    return index !== undefined ? [collection[index]] : collection;
  }
}

function getItemAtCollectionIndex(multiple, at) {
  return (collection) => {
    let index = at;

    if (!multiple) {
      index = 0;
    }

    return index !== undefined ? collection[0] : collection;
  }
}

module.exports = {
  getCollectionText,
  getCollectionAttribute,
  sendKeysToCollection,
  singleOrMultipleAsCollection,
  getItemAtCollectionIndex,
};