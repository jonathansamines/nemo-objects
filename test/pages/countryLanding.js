'use strict';

module.exports = function countryLanding(pageObject, nemo) {
  const { create, visitable, collection, text } = pageObject;

  return {
    scope: '.wrapper',
    visit: visitable(nemo.data.url),
    message: text('.single'),
    messages: text('.multiple', { multiple: true }),
    scopedMessage: text('.hello', { scope: '.scoped' }),
    resetMessage: text('.hello', { scope: '.reset-scope', resetScope: true }),
    messageAtPosition: text('.multiple', { multiple: true, at: 1 }),
    // countries: collection({
    //   scope: '.country-list',
    //   itemScope: 'ul li',
    //   item: {
    //     countryName: text('span'),
    //     countryCode: text('i'),
    //   },
    // })
  };
};