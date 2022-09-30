# Backend con NodeJs y Express

## Configuracion del entorno de desarrollo

- npm, git, eslint, nodemon

## Instalacion de Express

- Se instala express `npm i express`
- Se crea el primer servidor en el puerto 3000.
- /index.js

```
const express = require('express');
const myApp = express();
const port = 3002;

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

myApp.listen(port, () => {
  console.log("listen in port: " + port);
})

```

## RESTful API

- REST: Representational State Transfer
  Es una conveccion que se refiere a servicios web por protocolo HTTP

- Metodos:

Get: Obtener
Put: Modificar/Actualizar
Patch: Modificar/Actualizar
Post: Crear
Delete: Eliminar

## instalacion de Faker

- `npm i @faker-js/faker`
- ./index.js

```
const { faker } = require('@faker-js/faker');

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
```

## Single Responsibility Principle (SRP)

- Es un principio de programacion que indica que cada modulo o pieza de codigo, debe tener una sola responsabilidad o funcionalidad.

- Se crea el directorio routes con el archivo 'product.router.js'
- /routes/products.router.js

```
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
  res.json(products);
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    name: 'limonada',
    price: 19,
    id: id
  })
})


module.exports = router;

```

- Se hace lo mismo con las demas rutas.
- Posteriormente se crea el index.js del directorio routes:
- /routes/index.js

```
const productsRouter = require('./products.router');
const userRouter = require('./user.router');
const categoriesRouter = require('./categories.router');

function routerApi(app) {
  app.use('/products', productsRouter);
  app.use('/user', userRouter);
  app.use('/categories', categoriesRouter);
}
module.exports = routerApi;

```

- Luego se agrega el routerApi al root del proyecto
- index.js

```
const express = require('express');
const routerApi = require('./routes')

const myApp = express();
const port = 3002;

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

routerApi(myApp);


myApp.listen(port, () => {
  console.log("listen in port: " + port);
})


```
