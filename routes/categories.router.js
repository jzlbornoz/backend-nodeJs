const express = require('express');
const CategoriesServices = require('../services/categories.services');
const router = express.Router();
const {
  createCategorieSchema,
  getCategorieSchema,
} = require('../schemas/categories.schema');
const validatorHandler = require('../middlewares/validator.handler');

const service = new CategoriesServices();


// Get categories
router.get('/', async (req, res) => {
  const categories = await service.find();
  res.json(categories);
});

// Get categorie by id
router.get(
  '/:id',
  validatorHandler(getCategorieSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const categorie = await service.findCategorie(id);
      res.status(200).json(categorie);
    } catch (error) {
      next(error);
    }
  }
);

// Create Category
router.post(
  '/',
  validatorHandler(createCategorieSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategorie = await service.create(body);
      res.status(201).json(newCategorie);
    } catch (error) {
      next(error);
    }
  }
);

// Delete categorie by Id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const categorie = await service.delete(id);
    res.status(200).json(categorie);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
