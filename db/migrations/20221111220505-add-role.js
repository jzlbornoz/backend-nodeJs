'use strict';

/** @type {import('sequelize-cli').Migration} */


const { USERS_TABLE, userSchema } = require('../models/user.model')

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn(USERS_TABLE, 'role', userSchema.role);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(USERS_TABLE, 'role');
  }
};
