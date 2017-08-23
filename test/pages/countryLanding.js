'use strict';

const Promise = require('bluebird');

module.exports = function countryLanding(pageObject, nemo) {
  const {
    visitable,
    text,
    attribute,
    collection,
    count,
    hasClass,
    isVisible,
    value,
  } = pageObject;

  return {
    scope: '.wrapper',
    visit: visitable(nemo.data.url),

    // text
    message: text('.single'),
    messages: text('.multiple', { multiple: true }),
    scopedMessage: text('.hello', { scope: '.scoped' }),
    resetMessage: text('.hello', { scope: '.reset-scope', resetScope: true }),
    messageAtPosition: text('.multiple', { multiple: true, at: 1 }),

    // count
    messagesCount: count('.multiple'),
    scopedMessagesCount: count('.hello', { scope: '.scoped' }),
    resetScopeMessagesCount: count('.hello', { scope: '.reset-scope', resetScope: true }),

    // hasClass
    firstMessageIsSingle: hasClass('single', 'p'),
    allMessagesAreSingle: hasClass('single', 'p', { multiple: true }),
    scopedMessageIsHello: hasClass('hello', 'p', { scope: '.scoped' }),
    scopedResetMessageIsHello: hasClass('hello', 'p', { scope: '.reset-scope', resetScope: true }),
    thirdElementIsMultiple: hasClass('multiple', 'p', { multiple: true, at: 2 }),

    // attribute
    messageAttribute: attribute('data-attribute', '.single'),
    messagesAttribute: attribute('data-attribute', '.multiple', { multiple: true }),
    scopedMessageAttribute: attribute('data-attribute', '.hello', { scope: '.scoped' }),
    resetMessageAttribute: attribute('data-attribute', '.hello', { scope: '.reset-scope', resetScope: true }),
    messageAtPositionAttribute: attribute('data-attribute', '.multiple', { multiple: true, at: 1 }),

    // visibility
    isSingleMessageVisible: isVisible('.single'),
    areSingleMessagesVisible: isVisible('.single', { multiple: true }),
    isScopedMessageVisible: isVisible('.hidden', { scope: '.scoped' }),
    isResetScopedMessageVisible: isVisible('.hidden', { scope: '.reset-scope', resetScope: true }),
    isMessateAtPositionVisible: isVisible('.multiple', { multiple: true, at: 1 }),

    // value
    singleValue: value('.input-single'),
    multipleValues: value('.input-multiple', { multiple: true }),
    scopedValue: value('input', { scope: '.scoped' }),
    resetScopedValue: value('input', { scope: '.reset-scope', resetScope: true }),
    valueAtPosition: value('.input-multiple', { multiple: true, at: 1 }),

    countries: collection({
      scope: '.country-list',
      itemScope: 'ul li',
      item: {
        countryName: text('span'),
        countryCode: text('i'),
      },
    })
  };
};