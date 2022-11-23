const { User, userSchema } = require('./user.model');
const { Product, productsSchema } = require('./product.model');
const { Categorie, categorieSchema } = require('./catogories.model');
const { Costumer, costumerSchema } = require('./costumers.model');

function setUpModel(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Costumer.init(costumerSchema, Costumer.config(sequelize));
  Categorie.init(categorieSchema, Categorie.config(sequelize));
  Product.init(productsSchema, Product.config(sequelize));

  //Relaciones
  User.associate(sequelize.models);
  Costumer.associate(sequelize.models);
  Categorie.associate(sequelize.models);
  Product.associate(sequelize.models);
}

module.exports = setUpModel;
