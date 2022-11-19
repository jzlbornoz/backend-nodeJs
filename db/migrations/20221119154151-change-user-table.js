'use strict';

/** @type {import('sequelize-cli').Migration} */

const { USERS_TABLE, userSchema } = require('../models/user.model');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(USERS_TABLE, userSchema);
  },

  async down(queryInterface,) {
   await queryInterface.dropTable(USERS_TABLE);
  }
};
