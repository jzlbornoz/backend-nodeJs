const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(20);
const price = Joi.number().integer().min(1).max(40000);
const price_min = Joi.number().integer();
const price_max = Joi.number().integer();
const image = Joi.string().uri();
const soldBy = Joi.string().min(3).max(30);
const categoryId = Joi.number().integer();
const limit = Joi.number().integer();
const offset = Joi.number().integer();
const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required(),
  image: image.required(),
  soldBy: soldBy.required(),
  categoryId: categoryId.required(),
})

const updateProductSchema = Joi.object({
  name: name,
  price: price,
  image: image,
  categorieId: categoryId,
  soldBy: soldBy
})

const getProductSchema = Joi.object({
  id: id.required()
})

const queryProductSchema = Joi.object({
  limit: limit,
  offset: offset,
  price: price,
  price_min: price_min,
  price_max: price_max.when('price_min', {
    is: Joi.number().integer().required(),
    then: Joi.required()
  })
})


module.exports = { createProductSchema, updateProductSchema, getProductSchema, queryProductSchema }
