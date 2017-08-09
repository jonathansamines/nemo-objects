'use strict';

module.exports = function countryLanding(nemo) {
  const { visitable, collection, text } = nemo._page;

  return {
    visit: visitable(nemo.data.url),
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