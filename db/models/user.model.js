const { Model, DataTypes, Sequelize } = require('sequelize');

const USERS_TABLE = 'users';

const userSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: 'student'
  },
  nacionality: {
    allowNull: false,
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  },
  age: {
    allowNull: false,
    type: DataTypes.INTEGER
  }
}

class User extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate(models) {
    this.hasOne(models.Costumer, {
      as: 'costumer',
      foreignKey: 'user_id'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = { USERS_TABLE, userSchema, User }
