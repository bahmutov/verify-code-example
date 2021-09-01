// @ts-check
/// <reference types="cypress" />
const getDbUser = require('../../api/src/db.user');

module.exports = function (on, config) {
  on('task', {
    async getUser(id) {
      const user = await getDbUser(id);
      return user;
    }
  });
};
