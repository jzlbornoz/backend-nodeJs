const { User, userSchema } = require('./user.model');
const { Product, productsSchema } = require('./product.model');
const { Categorie, categorieSchema } = require('./catogories.model');
const { Costumer, costumerSchema } = require('./costumers.model');
const { Order, OrderSchema } = require('./orders.model');
const { OrderProduct , OrderProductSchema } = require('./order-product.model');

function setUpModel(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Costumer.init(costumerSchema, Costumer.config(sequelize));
  Categorie.init(categorieSchema, Categorie.config(sequelize));
  Product.init(productsSchema, Product.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));

  //Relaciones
  User.associate(sequelize.models);
  Costumer.associate(sequelize.models);
  Categorie.associate(sequelize.models);
  Product.associate(sequelize.models);
  Order.associate(sequelize.models);
  OrderProduct.associate(sequelize.models);
}

module.exports = setUpModel;
