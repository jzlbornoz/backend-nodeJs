'use strict';

const { DataTypes } = require('sequelize');
const { PRODUCTS_TABLE } = require('../models/product.model');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn(PRODUCTS_TABLE, 'image', {
      allowNull: false,
      type: DataTypes.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
