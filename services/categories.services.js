const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

class CategoriesServices {
  constructor() {
    (this.categories = []), this.generate();
  }

  generate() {
    this.categories.push(
      {
        name: 'shoes',
        id: faker.datatype.uuid(),
      },
      {
        name: 'clothes',
        id: faker.datatype.uuid(),
      },
      {
        name: 'tech',
        id: faker.datatype.uuid(),
      }
    );
  }

  async find() {
    return this.categories;
  }

  async create(data) {
    const newCategorie = {
      ...data,
      id: faker.datatype.uuid(),
    };
    this.categories.push(newCategorie);
    return newCategorie;
  }
  async findCategorie(id) {
    const categorie = this.categories.find((item) => item.id === id);
    if (!categorie) {
      throw boom.notFound("Categorie Not Found")
    }
    return categorie;
  }
  async delete(id) {
    const index = this.categories.findIndex((item) => item.id === id);
    if (index === -1) {
      throw boom.notFound('Product Not Found');
    } else {
      this.categories.splice(index, 1);
      return {
        message: `Categorie ${id} deleted`,
      };
    }
  }
}

module.exports = CategoriesServices;
