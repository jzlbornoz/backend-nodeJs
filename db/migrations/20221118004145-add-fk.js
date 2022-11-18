'use strict';

/** @type {import('sequelize-cli').Migration} */

const { COSTUMERS_TABLE, costumerSchema } = require('../models/costumers.model')

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(COSTUMERS_TABLE, costumerSchema);
  },

  async down(queryInterface,) {
    await queryInterface.drop(COSTUMERS_TABLE);
  }
};
