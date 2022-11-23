'use strict';

/** @type {import('sequelize-cli').Migration} */
const { PRODUCTS_TABLE, productsSchema } = require('../models/product.model');
const { CATEGORIES_TABLE, categorieSchema } = require('../models/catogories.model')
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(CATEGORIES_TABLE, categorieSchema);
    await queryInterface.createTable(PRODUCTS_TABLE, productsSchema);

  },

  async down(queryInterface) {
    await queryInterface.dropTable(CATEGORIES_TABLE);
    await queryInterface.dropTable(PRODUCTS_TABLE);
  }
};
