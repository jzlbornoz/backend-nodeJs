const { faker } = require('@faker-js/faker');

class ProductsServices {
  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        imaga: faker.image.imageUrl(),
        id: faker.datatype.uuid(),
      })
    }
  }
  create() { }

  find() {
    return this.products
  }

  findProduct(id) {
    return this.products.find(item => item.id === id);
  }

  update() { }
  delete() { }
}

module.exports = ProductsServices;
