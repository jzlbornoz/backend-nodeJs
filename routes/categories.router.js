const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    {
      name: 'Bebidas',
      id: 0
    },
    {
      name: 'Comidas',
      id: 1
    },
    {
      name: 'Postres',
      id: 2
    }
  ]);
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
