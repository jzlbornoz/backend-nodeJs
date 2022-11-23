const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(15);

const createCategorieSchema = Joi.object({
  name: name.required()
})

const updateCategorieSchema = Joi.object({
  name: name,
})

const getCategorieSchema = Joi.object({
  id: id.required()
})

module.exports = { createCategorieSchema, getCategorieSchema, updateCategorieSchema };
