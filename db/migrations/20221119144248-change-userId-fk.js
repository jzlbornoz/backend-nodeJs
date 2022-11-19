'use strict';

/** @type {import('sequelize-cli').Migration} */

const { COSTUMERS_TABLE } = require('../models/costumers.model');
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn(COSTUMERS_TABLE, 'user_id', {
      field: 'user_id',
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
    });
  },

  async down(queryInterface,) {
   // await queryInterface.dropTable(COSTUMERS_TABLE);
  }
};
