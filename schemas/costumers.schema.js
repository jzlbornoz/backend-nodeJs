const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(30);
const lastName = Joi.string();
const phone = Joi.string();
const userId = Joi.number().integer();
const email = Joi.string().email();
const password =  Joi.string();
const age = Joi.number().min(18);
const nacionality = Joi.string().min(2).max(15);
const role = Joi.string();

const createCostumerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
    age: age.required(),
    nacionality: nacionality.required(),
    role: role.required(),
  })
})

const updateCostumerSchema = Joi.object({
  name: name,
  lastName: lastName,
  phone: phone,
  userId: userId,
})

const getCostumerSchema = Joi.object({
  id: id.required(),
})


module.exports = { createCostumerSchema, getCostumerSchema, updateCostumerSchema };
