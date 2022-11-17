const { Model, DataTypes, Sequelize } = require('sequelize');

const COSTUMERS_TABLE = 'costumers';

const costumerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
    field: 'last_name'
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class Costumer extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate() {
    //
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: COSTUMERS_TABLE,
      modelName: 'Costumer',
      timestamps: false
    }
  }
}

module.exports = { COSTUMERS_TABLE, costumerSchema, Costumer }
