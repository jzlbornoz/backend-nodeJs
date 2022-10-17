const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().min(2).max(15);
const age = Joi.number().min(18);
const nacionality = Joi.string().min(2).max(15);

const createUserSchema = Joi.object({
  name: name.required(),
  age: age.required(),
  nacionality: nacionality.required(),
})

const updateUserSchema = Joi.object({
  name: name,
  age: age,
  nacionality: nacionality,
})

const getUserSchema = Joi.object({
  id: id.required(),
})


module.exports = { createUserSchema, getUserSchema , updateUserSchema };
