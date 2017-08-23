'use strict';

const Promise = require('bluebird');
const querystring = require('querystring');
const drivexBuilder = require('selenium-drivex');
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

  return {
    text: textProperty(nemo, drivex),
    fillable: fillableProperty(nemo, drivex),
    visitable: visitableProperty(nemo, drivex),
    collection: collectionProperty(nemo, drivex),
    attribute: attributeProperty(nemo, drivex),
    count: countProperty(nemo, drivex),
    hasClass: hasClassProperty(nemo, drivex),
    isVisible: isVisibleProperty(nemo, drivex),
    value: valueProperty(nemo, drivex),
  };
};