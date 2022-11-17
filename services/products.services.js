const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
class ProductsServices {
  constructor() { }

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const rta = await models.Product.findAll();
    return rta;
  }

  async findProduct(id) {
    const product = await models.Product.findByPk(id);
    if (!product) {
      throw boom.notFound("Product Not Found");
    }
    return product
  }

  async update(id, changes) {
    const product = await this.findProduct(id);
    const rta = await product.update(changes);
    return rta;
  }
  async delete(id) {
    const product = await this.findProduct(id);
    await product.destroy();
    return { id }
  }
}

module.exports = ProductsServices;
