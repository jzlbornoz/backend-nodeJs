const express = require('express');
const myApp = express();
const port = 3002;

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

myApp.get('/categories', (req, res) => {
  res.json({
    name: 'shoes',
    id: '2'
  });
});

myApp.get('/product', (req, res) => {
  res.json({
    name: 'agua',
    price: 22,
    id: 1
  });
});

myApp.listen(port, () => {
  console.log("listen in port: " + port);
})
