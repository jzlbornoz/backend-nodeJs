const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

class ProductsServices {
  constructor() {
    this.products = [];
    this.generate();
  }

  async generate() {
    const limit = 50;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        imaga: faker.image.imageUrl(),
        id: faker.datatype.uuid(),
        isBlock: faker.datatype.boolean(),
      })
    }
  }
  async create(data) {
    const newProduct = {
      id: faker.datatype.uuid(),
      ...data
    }
    this.products.push(newProduct);
    return newProduct;
  }

  find() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve((this.products))
      }, 2000)
    })
  }

  async findProduct(id) {
    const product = this.products.find(item => item.id === id);
    if (!product) {
      throw boom.notFound("Product Not Found");
    }
    if (product.isBlock) {
      throw boom.conflict("Product is Block");
    }
    return product
  }

  async update(id, changes) {
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound("Product Not Found");
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes
    }
    return this.products[index];
  }
  async delete(id) {
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound("Product Not Found");;
    }
    this.products.splice(index, 1);
    return {
      message: `Product ${id} deleted`,
    }
  }
}

module.exports = ProductsServices;
