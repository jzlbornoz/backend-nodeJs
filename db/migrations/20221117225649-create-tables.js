'use strict';

/** @type {import('sequelize-cli').Migration} */
const { USERS_TABLE, userSchema } = require('../models/user.model');
const { COSTUMERS_TABLE, costumerSchema } = require('../models/costumers.model');
const { PRODUCTS_TABLE, productsSchema } = require('../models/product.model');
const { CATEGORIES_TABLE, categorieSchema } = require('../models/catogories.model')
module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(USERS_TABLE, userSchema);
    await queryInterface.createTable(COSTUMERS_TABLE, costumerSchema);
    await queryInterface.createTable(PRODUCTS_TABLE, productsSchema);
    await queryInterface.createTable(CATEGORIES_TABLE, categorieSchema);
  },

  async down(queryInterface) {
    await queryInterface.dropTable(USERS_TABLE);
    await queryInterface.dropTable(COSTUMERS_TABLE);
    await queryInterface.dropTable(PRODUCTS_TABLE);
    await queryInterface.dropTable(CATEGORIES_TABLE);
  }
};
