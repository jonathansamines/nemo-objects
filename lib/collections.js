'use strict';

const Promise = require('bluebird');

function applyMethodToCollection(method) {
  return (...args) => (collection) => {
    return Promise.map(collection, (item) => item[method](...args));
  };
}

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

function countCollection(collection) {
  return collection.length;
}

module.exports = {
  countCollection,
  getCollectionText: applyMethodToCollection('getText'),
  getCollectionAttribute: applyMethodToCollection('getAttribute'),
  sendKeysToCollection: applyMethodToCollection('sendKeys'),
  clickOnCollection: applyMethodToCollection('click'),
  singleOrMultipleAsCollection,
  getItemAtCollectionIndex,
};