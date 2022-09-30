const express = require('express');
const { faker } = require('@faker-js/faker');
const myApp = express();
const port = 3002;

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

myApp.get('/categories', (req, res) => {
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

myApp.get('/products', (req, res) => {
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
  res.json(products);
});

myApp.get('/users', (req, res) => {
  const { limit, offset } = req.query;
  if (limit && offset) {
    res.json(
      {
        limit,
        offset
      }
    )
  } else {
    res.json({
      name: "admin",
      age: 12
    })
  }
})

myApp.get('/categories/:id', (req, res) => {
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

myApp.get('/products/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    name: 'limonada',
    price: 19,
    id: id
  })
})

myApp.listen(port, () => {
  console.log("listen in port: " + port);
})
