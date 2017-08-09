'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic(__dirname));

module.exports = (done) => {
  app.listen(3000, () => {
    console.log('Server listening at 3000');
    done();
  });
}