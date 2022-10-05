const express = require('express');
const ProductsServices = require('../services/products.services')

const router = express.Router();
const service = new ProductsServices();

router.get('/', (req, res) => {
  const products = service.find();
  res.status(200).json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const product = service.findProduct(id);
  if (product) {
    res.status(200).json(product)
  } else {
    res.status(404).json({
      message: "Not Found"
    })
  }
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
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: 'update parcial',
    data: body,
    id,
  })
})

// PUT
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const body = req.body;
  res.json({
    message: 'update',
    data: body,
    id,
  })
})

// DELETE

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    message: `DELETED: ${id}`,
    id,
  })
})

module.exports = router;
