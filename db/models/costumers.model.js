const { Model, DataTypes, Sequelize } = require('sequelize');
const { USERS_TABLE } = require('./user.model');

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
  },
  //FK
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: USERS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL'
  }
}

class Costumer extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
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
