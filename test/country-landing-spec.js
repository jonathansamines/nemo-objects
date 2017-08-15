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
      // text
      singleMessage: countryLanding.message(),
      multiple: countryLanding.messages(),
      scoped: countryLanding.scopedMessage(),
      resetMessage: countryLanding.resetMessage(),
      atPosition: countryLanding.messageAtPosition(),

      // count
      messagesCount: countryLanding.messagesCount(),
      scopedMessagesCount: countryLanding.scopedMessagesCount(),
      resetScopeMessagesCount: countryLanding.resetScopeMessagesCount(),

      // attribute
      singleMessageAttribute: countryLanding.messageAttribute(),
      multipleAttribute: countryLanding.messagesAttribute(),
      scopedAttribute: countryLanding.scopedMessageAttribute(),
      resetMessageAttribute: countryLanding.resetMessageAttribute(),
      atPositionAttribute: countryLanding.messageAtPositionAttribute(),

      // hasClass
      firstMessageIsSingle: countryLanding.firstMessageIsSingle(),
      allMessagesAreSingle: countryLanding.allMessagesAreSingle(),
      scopedMessageIsHello: countryLanding.scopedMessageIsHello(),
      scopedResetMessageIsHello: countryLanding.scopedResetMessageIsHello(),
      thirdElementIsMultiple: countryLanding.thirdElementIsMultiple(),

      countries: countryLanding.countries(),
    })
    .then((options) => {
      console.log(options);

      expect(options).to.be.deep.equal({
        // text
        singleMessage: 'Hello to the single world 1',
        multiple: [ 'Hello to the world 1', 'Hello to the world 2' ],
        scoped: 'Hello to the scoped world',
        resetMessage: 'Hello to the reset-scoped world',
        atPosition: 'Hello to the world 2',

        // count
        messagesCount: 2,
        scopedMessagesCount: 1,
        resetScopeMessagesCount: 1,

        // hasClass
        firstMessageIsSingle: true,
        allMessagesAreSingle: false,
        scopedMessageIsHello: true,
        scopedResetMessageIsHello: true,
        thirdElementIsMultiple: true,

        // attribute
        singleMessageAttribute: 'hello single attribute 1',
        multipleAttribute: [ 'hello attribute 1', 'hello attribute 2' ],
        scopedAttribute: 'hello scoped attribute',
        resetMessageAttribute: 'reset-scoped attribute',
        atPositionAttribute: 'hello attribute 2',
        countries: [ { countryName: 'Guatemala', countryCode: 'GT' },
          { countryName: 'Guatemala', countryCode: 'GT' },
          { countryName: 'Guatemala', countryCode: 'GT' },
          { countryName: 'Guatemala', countryCode: 'GT' } ]
      });
    });
  });
});