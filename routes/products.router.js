const express = require('express');
const { faker } = require('@faker-js/faker');

const router = express.Router();

router.get('/', (req, res) => {
  const products = [];
  const { size } = req.query;
  const limit = parseInt(size) || 5;
  for (let i = 0; i < limit; i++) {
    products.push({
      name: faker.commerce.productName(),
      price: parseInt(faker.commerce.price(), 10),
      imaga: faker.image.imageUrl(),
      id: i,
    })
  }
  res.status(200).json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    name: faker.commerce.productName(),
    price: parseInt(faker.commerce.price(), 10),
    imaga: faker.image.imageUrl(),
    id,
  })
})

// POST

router.post('/', (req, res) => {
  const body = req.body;
  res.json({
    message: 'created',
    data: body
  })
})

// Patch
router.patch('/:id', (req, res) => {
  const {id} = req.params;
  const body = req.body;
  res.json({
    message: 'update parcial',
    data: body,
    id,
  })
})

// PUT
router.put('/:id', (req, res) => {
  const {id} = req.params;
  const body = req.body;
  res.json({
    message: 'update',
    data: body,
    id,
  })
})

// DELETE

router.delete('/:id', (req, res) => {
  const {id} = req.params;
  res.json({
    message: `DELETED: ${id}`,
    id,
  })
})

module.exports = router;
