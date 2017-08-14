'use strict';

module.exports = function countryLanding(pageObject, nemo) {
  const { visitable, text, attribute, collection } = pageObject;

  return {
    scope: '.wrapper',
    visit: visitable(nemo.data.url),

    // text
    message: text('.single'),
    messages: text('.multiple', { multiple: true }),
    scopedMessage: text('.hello', { scope: '.scoped' }),
    resetMessage: text('.hello', { scope: '.reset-scope', resetScope: true }),
    messageAtPosition: text('.multiple', { multiple: true, at: 1 }),

    // attribute
    messageAttribute: attribute('data-attribute', '.single'),
    messagesAttribute: attribute('data-attribute', '.multiple', { multiple: true }),
    scopedMessageAttribute: attribute('data-attribute', '.hello', { scope: '.scoped' }),
    resetMessageAttribute: attribute('data-attribute', '.hello', { scope: '.reset-scope', resetScope: true }),
    messageAtPositionAttribute: attribute('data-attribute', '.multiple', { multiple: true, at: 1 }),

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