const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class costumersService {
  constructor() { }

  async getCostumers() {
    const rta = await models.Costumer.findAll();
    return rta;
  }
  async getCostumer(id) {
    const Costumer = await models.Costumer.findByPk(id);
    if (!Costumer) {
      throw boom.notFound("Costumer do not Exist");
    }
    return Costumer;
  }
  async createCostumer(data) {
    const newCostumer = await models.Costumer.create(data);
    return newCostumer;
  }
  async updateCostumer(id, update) {
    const Costumer = await this.getCostumer(id);
    const rta = await Costumer.update(update);
    return rta;
  }
  async deleteCostumer(id) {
    const Costumer = await this.getCostumer(id);
    await Costumer.destroy();
    return { id };
  }
}

module.exports = costumersService;
