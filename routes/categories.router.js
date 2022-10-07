const express = require('express');
const CategoriesServices = require('../services/categories.services');
const router = express.Router();

const service = new CategoriesServices();

router.get('/', async (req, res) => {
const categories = await service.find();
  res.json(categories);
});


router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (id == 0) {
    res.json(
      {
        name: 'Bebidas',
        id: id
      },
    )
  } else if (id == 1) {
    res.json(
      {
        name: 'Comidas',
        id: id
      }
    )
  } else {
    res.json(
      {
        name: 'Postres',
        id: id
      }
    )
  }
})

module.exports = router;
