const Joi = require('joi');

const id = Joi.number();
const name = Joi.string().min(2).max(15);
const age = Joi.number().min(18);
const nacionality = Joi.string().min(2).max(15);
const email = Joi.string();
const password = Joi.string();
const role = Joi.string();

const createUserSchema = Joi.object({
  name: name.required(),
  age: age.required(),
  nacionality: nacionality.required(),
  email: email.required(),
  password: password.required(),
  role: role
})

const updateUserSchema = Joi.object({
  name: name,
  age: age,
  nacionality: nacionality,
  role: role
})

const getUserSchema = Joi.object({
  id: id.required(),
})


module.exports = { createUserSchema, getUserSchema , updateUserSchema };
