'use strict';

const locatorBuilder = require('./locator');
const controlBuilder = require('./dom-control');
const attributeProperty = require('./properties/attribute');
const clickableProperty = require('./properties/clickable');
const collectionProperty = require('./properties/collection');
const countProperty = require('./properties/count');
const fillableProperty = require('./properties/fillable');
const hasClassProperty = require('./properties/hasClass');
const isVisibleProperty = require('./properties/isVisible');
const textProperty = require('./properties/text');
const valueProperty = require('./properties/value');
const visitableProperty = require('./properties/visitable');

module.exports = function pageObject(nemo) {
  const control = controlBuilder(nemo.driver);
  const descriptor = locatorBuilder(nemo, control);

  return {
    text: textProperty(nemo, control, descriptor),
    fillable: fillableProperty(nemo, control, descriptor),
    visitable: visitableProperty(nemo, control, descriptor),
    collection: collectionProperty(nemo, control, descriptor),
    attribute: attributeProperty(nemo, control, descriptor),
    count: countProperty(nemo, control, descriptor),
    hasClass: hasClassProperty(nemo, control, descriptor),
    isVisible: isVisibleProperty(nemo, control, descriptor),
    clickable: clickableProperty(nemo, control, descriptor),
    value: valueProperty(nemo, control, descriptor),
  };
};