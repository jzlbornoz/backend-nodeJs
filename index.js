const express = require('express');
const routerApi = require('./routes')
const { logErrors, errorHandler, boomHandler } = require('./middlewares/error.handler');
const cors = require('cors');

const myApp = express();
const port = process.env.PORT ||3000;

myApp.use(express.json());


const whiteList = ['http://localhost:3000', 'http://127.0.0.1:5500'];
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      callback(null , true);
    } else {
     callback(new Error("No permitido") )
    }
  }
}
myApp.use(cors(options));

myApp.get('/', (req, res) => {
  res.send('HOLA MUNDO');
});

routerApi(myApp);

myApp.use(logErrors);
myApp.use(boomHandler);
myApp.use(errorHandler);

myApp.listen(port, () => {
  return "listen in port: " + port
})

