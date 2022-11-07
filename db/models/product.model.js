const { Model, DataTypes } = require('sequelize');

const PRODUCTS_TABLE = 'products';

const productsSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  price: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  soldBy: {
    allowNull: false,
    type: DataTypes.STRING,
  }
}

class Product extends Model {
  static associate() {
    //
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCTS_TABLE,
      modelName: 'Product',
      timestamps: false
    }
  }
}

module.exports = { PRODUCTS_TABLE, productsSchema, Product };
