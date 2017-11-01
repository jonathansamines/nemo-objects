'use strict';

const Promise = require('bluebird');
const nemoBuilder = require('nemo');
const { expect } = require('chai');
const server = require('./fixtures/server');

describe('At the landing page', () => {
  let nemo;
  let countryLanding;

  before(async () => {
    nemo = await nemoBuilder(__dirname);
    await server();

    countryLanding = nemo.objects.countryLanding;
  });

  it('returns the list of available countries', async () => {
    await countryLanding.visit();

    const model = await Promise.props({
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

      // visible
      isSingleMessageVisible: countryLanding.isSingleMessageVisible(),
      areSingleMessagesVisible: countryLanding.areSingleMessagesVisible(),
      isScopedMessageVisible: countryLanding.isScopedMessageVisible(),
      isResetScopedMessageVisible: countryLanding.isResetScopedMessageVisible(),
      isMessateAtPositionVisible: countryLanding.isMessateAtPositionVisible(),

      singleValue: countryLanding.singleValue(),
      multipleValues: countryLanding.multipleValues(),
      scopedValue: countryLanding.scopedValue(),
      resetScopedValue: countryLanding.resetScopedValue(),
      valueAtPosition: countryLanding.valueAtPosition(),

      // hasClass
      firstMessageIsSingle: countryLanding.firstMessageIsSingle(),
      allMessagesAreSingle: countryLanding.allMessagesAreSingle(),
      scopedMessageIsHello: countryLanding.scopedMessageIsHello(),
      scopedResetMessageIsHello: countryLanding.scopedResetMessageIsHello(),
      thirdElementIsMultiple: countryLanding.thirdElementIsMultiple(),

      countries: countryLanding.countries(),
    });

    expect(model).to.be.deep.equal({
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

      // visible
      isSingleMessageVisible: true,
      areSingleMessagesVisible: true,
      isScopedMessageVisible: false,
      isResetScopedMessageVisible: false,
      isMessateAtPositionVisible: true,

      // value
      singleValue: 'Hello single value 1',
      multipleValues: [ 'Hello multiple value 1', 'Hello multiple value 2' ],
      scopedValue: 'Hello scoped value',
      resetScopedValue: 'Hello reset scoped value',
      valueAtPosition: 'Hello multiple value 2',

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