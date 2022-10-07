const express = require('express');
const CategoriesServices = require('../services/categories.services');
const router = express.Router();

const service = new CategoriesServices();

router.get('/', async (req, res) => {
  const categories = await service.find();
  res.json(categories);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const categorie = await service.findCategorie(id);
  if (categorie) {
    res.status(200).json(categorie)
  } else {
    res.status(404).json({
      message: `Not Found: ${id}`
    })
  }
});


router.post('/', async (req, res) => {
  const body = req.body;
  const newCategorie = await service.create(body);
  if (newCategorie) {
    res.status(201).json(newCategorie);
  } else {
    res.status(404).json({
      message: "Fatal error"
    })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const categorie = await service.delete(id);
    res.status(200).json(categorie)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
})

module.exports = router;
