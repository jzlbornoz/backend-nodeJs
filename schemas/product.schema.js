const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(3).max(20);
const price = Joi.number().integer().min(1).max(40000);
const image = Joi.string().uri();
const categoriesId = Joi.array();
const soldBy = Joi.string().min(3).max(30);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  categoriesId: categoriesId.required(),
  image: image.required(),
  soldBy: soldBy.required()
})

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  categoriesId: categoriesId.required(),
  soldBy: soldBy
})

const getProductSchema = Joi.object({
  id: id.required()
})

module.exports = { createProductSchema, updateProductSchema, getProductSchema }
