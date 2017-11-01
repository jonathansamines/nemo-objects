'use strict';

const drivexBuilder = require('selenium-drivex');
const locatorBuilder = require('./locator');
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
  const drivex = drivexBuilder(nemo.driver, nemo.wd);
  const descriptor = locatorBuilder(nemo, drivex);

  return {
    text: textProperty(nemo, drivex, descriptor),
    fillable: fillableProperty(nemo, drivex, descriptor),
    visitable: visitableProperty(nemo, drivex, descriptor),
    collection: collectionProperty(nemo, drivex, descriptor),
    attribute: attributeProperty(nemo, drivex, descriptor),
    count: countProperty(nemo, drivex, descriptor),
    hasClass: hasClassProperty(nemo, drivex, descriptor),
    isVisible: isVisibleProperty(nemo, drivex, descriptor),
    value: valueProperty(nemo, drivex, descriptor),
  };
};