const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class CategoriesServices {
  constructor() {}

  async find() {
    const rta = await models.Categorie.findAll();
    return rta;
  }

  async create(data) {
    const newCategorie = await models.Categorie.create(data);
    return newCategorie;
  }
  async findCategorie(id) {
    const categorie = await models.Categorie.findByPk(id , {
      include: ['products'] // es el nombre que se le pone en el associate del model {as: 'products'}
    });
    if (!categorie) {
      throw boom.notFound("Categorie Not Found");
    }
    return categorie;
  }
  async delete(id) {
    const categorie = await this.findCategorie(id);
    await categorie.destroy();
    return { id };

  }
}

module.exports = CategoriesServices;
