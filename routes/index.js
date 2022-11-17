const express = require('express');
const productsRouter = require('./products.router');
const userRouter = require('./users.router');
const categoriesRouter = require('./categories.router');
const costumerRouter = require('./costumers.router');

function routerApi(app) {

  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/products', productsRouter);
  router.use('/user', userRouter);
  router.use('/costumer', costumerRouter);
  router.use('/categories', categoriesRouter);
}
module.exports = routerApi;
