'use strict';

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

    return countryLanding
      .countries()
      .then((countries) => {
        console.log(countries);
      });
  });
});