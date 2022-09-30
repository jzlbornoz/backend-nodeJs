const express = require('express');
const routerApi = require('./routes')

const myApp = express();
const port = 3002;

myApp.use(express.json());

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

routerApi(myApp);


myApp.listen(port, () => {
  console.log("listen in port: " + port);
})

