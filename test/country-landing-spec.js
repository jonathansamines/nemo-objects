'use strict';

const Promise = require('bluebird');
const nemoBuilder = require('nemo');
const { expect } = require('chai');
const server = require('./fixtures/server');

describe('At the landing page', () => {
  let nemo;

  before((done) => {
    nemoBuilder(__dirname).then((instance) => {
      nemo = instance;

      server(done);
    })
    .catch(done);
  });

  it('returns the list of available countries', () => {
    const { countryLanding } = nemo.page;

    countryLanding.visit();

    return Promise.props({
      singleMessage: countryLanding.message(),
      multiple: countryLanding.messages(),
      scoped: countryLanding.scopedMessage(),
      resetMessage: countryLanding.resetMessage(),
      atPosition: countryLanding.messageAtPosition(),

      singleMessageAttribute: countryLanding.messageAttribute(),
      multipleAttribute: countryLanding.messagesAttribute(),
      scopedAttribute: countryLanding.scopedMessageAttribute(),
      resetMessageAttribute: countryLanding.resetMessageAttribute(),
      atPositionAttribute: countryLanding.messageAtPositionAttribute(),
    })
    .then((options) => {
      console.log(options);

      expect(options).to.be.deep.equal({
        singleMessage: 'Hello to the single world 1',
        multiple: [ 'Hello to the world 1', 'Hello to the world 2' ],
        scoped: 'Hello to the scoped world',
        resetMessage: 'Hello to the reset-scoped world',
        atPosition: 'Hello to the world 2',
        singleMessageAttribute: 'hello single attribute 1',
        multipleAttribute: [ 'hello attribute 1', 'hello attribute 2' ],
        scopedAttribute: 'hello scoped attribute',
        resetMessageAttribute: 'reset-scoped attribute',
        atPositionAttribute: 'hello attribute 2'
      });
    });
  });
});