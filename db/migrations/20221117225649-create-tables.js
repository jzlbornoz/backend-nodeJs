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
    await queryInterface.drop(USERS_TABLE);
    await queryInterface.drop(COSTUMERS_TABLE);
    await queryInterface.drop(PRODUCTS_TABLE);
    await queryInterface.drop(CATEGORIES_TABLE);
  }
};
