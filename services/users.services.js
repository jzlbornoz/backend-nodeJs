const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class usersService {
  constructor() { }

  async getUsers() {
    const rta = await models.User.findAll({
      include: ['costumer']
    });
    return rta;
  }
  async getUser(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound("User do not Exist");
    }
    return user;
  }
  async createUser(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }
  async updateUser(id, update) {
    const user = await this.getUser(id);
    const rta = await user.update(update);
    return rta;
  }
  async deleteUser(id) {
    const user = await this.getUser(id);
    await user.destroy();
    return { id };
  }
}

module.exports = usersService;
