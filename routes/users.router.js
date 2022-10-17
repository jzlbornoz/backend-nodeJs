const express = require('express');
const usersService = require('../services/users.services');
const { createUserSchema, getUserSchema, updateUserSchema } = require('../schemas/users.schema');
const validatorHandler = require('../middlewares/validator.handler');

const router = express.Router();
const service = new usersService();

// GET users
router.get('/', async (req, res) => {
  const users = await service.getUsers();
  res.status(200).json(users);
})

// GET user by id
router.get('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.getUser(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  })

//POST Create user
router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const user = await service.createUser(body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  })

// PUT & PATCH update user
router.put('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body
      const userUpdated = await service.updateUser(id, body);
      res.status(200).json(userUpdated);
    } catch (error) {
      next(error);
    }
  })

router.patch('/:id',
  validatorHandler(getUserSchema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body
      const userUpdated = await service.updateUser(id, body);
      res.status(200).json(userUpdated);
    } catch (error) {
      next(error);
    }
  })

// Delete user by id
router.delete('/:id',
  validatorHandler(getUserSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const userDeleted = service.deleteUser(id);
      res.status(200).json(userDeleted);
    } catch (error) {
      next(error);
    }
  })

module.exports = router;
