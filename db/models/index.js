const {User, userSchema} = require('./user.model');

function setUpModel(sequelize) {
  User.init(userSchema , User.config(sequelize));
}

module.exports = setUpModel;
