const express = require('express');
const costumersService = require('../services/costumer.services');
const { createCostumerSchema, getCostumerSchema, updateCostumerSchema } = require('../schemas/costumers.schema');
const validatorHandler = require('../middlewares/validator.handler');

const router = express.Router();
const service = new costumersService();

// GET Costumers
router.get('/', async (req, res, next) => {
  try {
    const Costumers = await service.getCostumers();
    res.status(200).json(Costumers);
  } catch (error) {
    next(error);
  }
})

// GET Costumer by id
router.get('/:id',
  validatorHandler(getCostumerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const Costumer = await service.getCostumer(id);
      res.status(200).json(Costumer);
    } catch (error) {
      next(error);
    }
  })

//POST Create Costumer
router.post('/',
  validatorHandler(createCostumerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const Costumer = await service.createCostumer(body);
      res.status(201).json(Costumer);
    } catch (error) {
      next(error);
    }
  })

// PUT & PATCH update Costumer
router.put('/:id',
  validatorHandler(getCostumerSchema, 'params'),
  validatorHandler(updateCostumerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body
      const CostumerUpdated = await service.updateCostumer(id, body);
      res.status(200).json(CostumerUpdated);
    } catch (error) {
      next(error);
    }
  })

router.patch('/:id',
  validatorHandler(getCostumerSchema, 'params'),
  validatorHandler(updateCostumerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body
      const CostumerUpdated = await service.updateCostumer(id, body);
      res.status(200).json(CostumerUpdated);
    } catch (error) {
      next(error);
    }
  })

// Delete Costumer by id
router.delete('/:id',
  validatorHandler(getCostumerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const CostumerDeleted = await service.deleteCostumer(id);
      res.status(201).json({ CostumerDeleted });
    } catch (error) {
      next(error);
    }
  })

module.exports = router;
