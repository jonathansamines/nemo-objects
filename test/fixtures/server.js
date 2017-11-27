'use strict';

const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');
const app = express();

const publicDir = path.join(__dirname, './html');

app.use(serveStatic(publicDir));

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = app.listen(3000, (err) => {
      if (err) return reject(err);

      console.log('Server listening at 3000');

      return resolve(server);
    });
  });
}