const { Model, DataTypes } = require('sequelize');

const { CATEGORIES_TABLE } = require('./catogories.model');

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
  image: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  soldBy: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  //FK
  categoryId: {
    field: 'category_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORIES_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL'
  }
}

class Product extends Model {

  static associate(models) {
    this.belongsTo(models.Categorie, {
      as: 'category'
    });
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
