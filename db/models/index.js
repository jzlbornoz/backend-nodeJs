const { User, userSchema } = require('./user.model');
const { Product, productsSchema } = require('./product.model');
const {Categorie , categorieSchema} = require('./catogories.model');

function setUpModel(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Product.init(productsSchema, Product.config(sequelize));
  Categorie.init(categorieSchema, Categorie.config(sequelize));
}

module.exports = setUpModel;
