'use strict';

function getElementAt(collection, multiple, at) {
  let index = at;

  if (!multiple) {
    index = 0;
  }

  // If an index was defined because:
  // - The user specified the "at" option
  // - Or the 0 default was used on single cases
  // then we return the first collection element, because:
  // - When the user specifies the "at" parameter we already filtered the collection
  // - When is a single element, there is only one element anyway
  return index !== undefined ? collection[0] : collection;
}

module.exports = {
  getElementAt,
};