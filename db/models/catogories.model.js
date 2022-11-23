const { Model, DataTypes } = require('sequelize');

const CATEGORIES_TABLE = 'categories';

const categorieSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  }
}

class Categorie extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORIES_TABLE,
      modelName: 'Categorie',
      timestamps: false
    }
  }
}

module.exports = { CATEGORIES_TABLE, categorieSchema, Categorie }
