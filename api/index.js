// @ts-check

// import the DB config to check if DB settings are set
require('./src/db.config.js');
const signup = require('./src/signup');
const phone = require('./src/phone');
const code = require('./src/code');

// using https://github.com/dotcypress/micro-route
// to route different requests to their own handlers
const dispatch = require('micro-route/dispatch');

const greeting = () => 'Welcome to Micro!';

module.exports = dispatch()
  .dispatch('/signup', 'POST', signup)
  .dispatch('/phone', 'POST', phone)
  .dispatch('/code', 'POST', code)
  .otherwise(greeting);
