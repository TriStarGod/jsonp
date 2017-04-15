/*jshint node:true */
'use strict';

if (process.env.NEW_RELIC_LICENSE_KEY) {
  require('newrelic');
} else {
  console.warn("New Relic agent not being started because NEW_RELIC_LICENSE_KEY is missing.");
}

const express = require('express'),
  morgan = require('morgan'),
  compress = require('compression'),
  cors = require('cors'),
  jsonp = require('./jsonp'),
  redirector = require('./redirector'),
  router = require('./router'),
  keenMiddleware = require('./keen/middleware');

let app = express();

app.set('query parser', 'simple');
app.enable('trust proxy');

// logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}
app.use(compress());
app.use(cors({
  maxAge: 60 * 60 * 24, // one day
  methods: ['GET']
}));
app.use(redirector.middleware);
app.use(jsonp);
app.use(express.static(`${__dirname}/..`));
app.use(keenMiddleware);
app.use('/', router);

module.exports = app;
