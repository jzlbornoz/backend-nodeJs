const { User, userSchema } = require('./user.model');
const { Product, productSchema } = require('./product.model');

function setUpModel(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Product.init(productSchema, Product.config(sequelize));
}

module.exports = setUpModel;
