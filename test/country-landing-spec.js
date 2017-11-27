'use strict';

const nemoBuilder = require('nemo');
const { expect } = require('chai');
const server = require('./fixtures/server');

describe('At the landing page', () => {
  let nemo;
  let app;
  let countryLanding;

  before(async () => {
    nemo = await nemoBuilder(__dirname);
    app = await server();

    ({ countryLanding } = nemo.objects);
  });

  after(async () => {
    await nemo.driver.quit();
    await app.close();
  });

  it('returns the list of available countries', async () => {
    await countryLanding.visit();

    const model = {
      // text
      singleMessage: await countryLanding.message(),
      multiple: await countryLanding.messages(),
      scoped: await countryLanding.scopedMessage(),
      resetMessage: await countryLanding.resetMessage(),
      atPosition: await countryLanding.messageAtPosition(),

      // count
      messagesCount: await countryLanding.messagesCount(),
      scopedMessagesCount: await countryLanding.scopedMessagesCount(),
      resetScopeMessagesCount: await countryLanding.resetScopeMessagesCount(),

      // attribute
      singleMessageAttribute: await countryLanding.messageAttribute(),
      multipleAttribute: await countryLanding.messagesAttribute(),
      scopedAttribute: await countryLanding.scopedMessageAttribute(),
      resetMessageAttribute: await countryLanding.resetMessageAttribute(),
      atPositionAttribute: await countryLanding.messageAtPositionAttribute(),

      // visible
      isSingleMessageVisible: await countryLanding.isSingleMessageVisible(),
      areSingleMessagesVisible: await countryLanding.areSingleMessagesVisible(),
      isScopedMessageVisible: await countryLanding.isScopedMessageVisible(),
      isResetScopedMessageVisible: await countryLanding.isResetScopedMessageVisible(),
      isMessateAtPositionVisible: await countryLanding.isMessateAtPositionVisible(),

      singleValue: await countryLanding.singleValue(),
      multipleValues: await countryLanding.multipleValues(),
      scopedValue: await countryLanding.scopedValue(),
      resetScopedValue: await countryLanding.resetScopedValue(),
      valueAtPosition: await countryLanding.valueAtPosition(),

      // hasClass
      firstMessageIsSingle: await countryLanding.firstMessageIsSingle(),
      allMessagesAreSingle: await countryLanding.allMessagesAreSingle(),
      scopedMessageIsHello: await countryLanding.scopedMessageIsHello(),
      scopedResetMessageIsHello: await countryLanding.scopedResetMessageIsHello(),
      thirdElementIsMultiple: await countryLanding.thirdElementIsMultiple(),

      countries: await countryLanding.countries(),
    };

    expect(model).to.be.deep.equal({
      // text
      singleMessage: 'Hello to the single world 1',
      multiple: ['Hello to the world 1', 'Hello to the world 2'],
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
      multipleValues: ['Hello multiple value 1', 'Hello multiple value 2'],
      scopedValue: 'Hello scoped value',
      resetScopedValue: 'Hello reset scoped value',
      valueAtPosition: 'Hello multiple value 2',

      // attribute
      singleMessageAttribute: 'hello single attribute 1',
      multipleAttribute: ['hello attribute 1', 'hello attribute 2'],
      scopedAttribute: 'hello scoped attribute',
      resetMessageAttribute: 'reset-scoped attribute',
      atPositionAttribute: 'hello attribute 2',
      countries: [{ countryName: 'Guatemala', countryCode: 'GT' },
        { countryName: 'Guatemala', countryCode: 'GT' },
        { countryName: 'Guatemala', countryCode: 'GT' },
        { countryName: 'Guatemala', countryCode: 'GT' }],
    });
  });
});
