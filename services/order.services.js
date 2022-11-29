const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class OrderServices {
  constructor() {
  }

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }
  async addItem(data) {
    const itemToAdd = await models.OrderProduct.create(data);
    return itemToAdd;
  }

  async find() {
    return [];
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'costumer',
          include: ['user'],

        },
        'items'
      ],
    });
    if (!order) {
      throw boom.notFound("Order does not exist");
    }
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = OrderServices;
