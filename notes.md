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
const express = require('express');
const productsRouter = require('./products.router');
const userRouter = require('./users.router');
const categoriesRouter = require('./categories.router');

function routerApi(app) {
  const router = express.Router();
  app.use('api/v1', router);
  router.use('/products', productsRouter);
  router.use('/user', userRouter);
  router.use('/categories', categoriesRouter);
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

## POST Method

- Se crea el metedo que atiende al llamado POST
- ./routes/products.router.js

```
// POST

router.post('/', (req, res) => {
  const body = req.body;
  res.json({
    message: 'created',
    data: body
  })
})
```

## UPDATE Methods (Put and Patch)

- Se crean los metodos que atienden a los llamados PUT y PATCH
- ./routes/products.router.js

```
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

```

## Clean Architecture

- Esta arquitectura se defince por capas:

  - Capa 1 (Entidades): En esta capa se encuentras las entidades base del negocio o sistema.
  - Capa 2 (Casos de Uso): Se encuentra todo lo relacionado a los servicios o la logica del negocio o sistema.
  - Capa 3 (Controladores): Por lo general es donde se encuentra el routing.
  - Capa 4 (Interfaz): Se encuentra la web, UI y DB.

- Se crea el directorio 'services' y el servicio de productos 'products.services.js'.
- Se extrae la logica del router y se agrega en el services.
- services/products.services.js:

```
const { faker } = require('@faker-js/faker');

class ProductsServices {
  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    const limit = 50;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        imaga: faker.image.imageUrl(),
        id: faker.datatype.uuid(),
      })
    }
  }
  create() { }

  find() {
    return this.products
  }

  findProduct(id) {
    return this.products.find(item => item.id === id);
  }

  update() { }
  delete() { }
}

module.exports = ProductsServices;

```

## Async Await and Error capture

- La gran mayoria de los servicios de trabajan de manera asincrona.
- Se agregan el async a todos los servicios que no retornen una promesa.
- Los llamados del router ahora se haran de manera asincrona.

- routes/products.router.js

```
const express = require('express');
const ProductsServices = require('../services/products.services')

const router = express.Router();
const service = new ProductsServices();


// GET
router.get('/', async (req, res) => {
  const products = await service.find();
  res.status(200).json(products);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const product = await service.findProduct(id);
  if (product) {
    res.status(200).json(product)
  } else {
    res.status(404).json({
      message: "Not Found"
    })
  }
})

// POST

router.post('/', async (req, res) => {
  const body = req.body;
  const newProduct = await service.create(body);
  if (newProduct) {
    res.status(201).json(newProduct);
  } else {
    res.status(404).json({
      message: "Fatal error"
    })
  }

})

// Patch
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
})

// PUT
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
})

// DELETE

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await service.delete(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
})

module.exports = router;

```

- /services/products.services.js

```
const { faker } = require('@faker-js/faker');

class ProductsServices {
  constructor() {
    this.products = [];
    this.generate();
  }

  async generate() {
    const limit = 50;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        name: faker.commerce.productName(),
        price: parseInt(faker.commerce.price(), 10),
        imaga: faker.image.imageUrl(),
        id: faker.datatype.uuid(),
      })
    }
  }
  async create(data) {
    const newProduct = {
      id: faker.datatype.uuid(),
      ...data
    }
    this.products.push(newProduct);
    return newProduct;
  }

  find() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve((this.products))
      }, 5000)
    })
  }

  async findProduct(id) {
    return this.products.find(item => item.id === id);
  }

  async update(id, changes) {
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes
    }
    return this.products[index];
  }
  async delete(id) {
    const index = this.products.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("Product not found");
    }
    this.products.splice(index, 1);
    return {
      message: `Product ${id} deleted`,
    }
  }
}

module.exports = ProductsServices;

```

## Middlewares

- Un middleware es un bloque de código que se ejecuta entre la petición que hace el usuario (request) hasta que la petición llega al servidor.
- Se crea un middleware global, que se encargara en formatear el error de una forma adecuada para el cliente.
- /middlewares/error.handler.js

```
function logErrors(err, req, res, next) {
  console.error(err);
  next(err);
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack
  })
}

module.exports = { logErrors, errorHandler };

```

- Se agrega al index del proyecto:

```

myApp.use(logErrors);
myApp.use(boomHandler);
myApp.use(errorHandler);
```

## Manejo de Errores con Boom

- Nos facilita el manejo de errores respetando los status codes.
- `npm i @hapi/boom`.
- Se crea el middleware para los errores de boom.
- /middlewares/error.handler.js

```

function boomHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

```

## Validacion de Datos

- Para al validacion se utilizara al herramienta Joi.
- `npm i joi`.
- Se crea el directorio donde van a estar los eschemas de validacion o data transfer object (dto).
- Se crea las validaciones de cada uno de los datos que se vana recibir, para posteriormente consumirlos en cada uno de los objetos Joi:
- /schemas/product.schema.js

```
const Joi = require('joi');

const id = Joi.string().uuid();
const name = Joi.string().alphanum().min(3).max(20);
const price = Joi.number().integer().min(1).max(40000);

const createProductSchema = Joi.object({
  name: name.required(),
  price: price.required()
})

const updateProductSchema = Joi.object({
  name: name,
  price: price,
})

const getProductSchema = Joi.object({
  id: id.required()
})

module.exports = { createProductSchema , updateProductSchema , getProductSchema}


```

- Se creara un middleware dinamico con un clousure de Js que recibira los schemas:
- middlewares/validator.handler.js

```
const boom = require('@hapi/boom');


//clousure
function validatorHandler(schema, property) {
  return (req, res, next) => {
    const data = req[property];
    const { error } = schema.validate(data);
    if (error) {
      next(boom.badRequestA(data));
    }
    next();
  }
}

module.exports = validatorHandler;

```

- Este middleware no entraria a funcionar de manera global, ya que cada endpoint debe definir que schema se va a utilizar.
- se agrega los middleware en los router de products:
- routes/product.router.js

```
const express = require('express');
const ProductsServices = require('../services/products.services');
const validatorHandler = require('../middlewares/validator.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema
} = require('../schemas/product.schema');

const router = express.Router();
const service = new ProductsServices();



// GET
router.get('/', async (req, res) => {
  const products = await service.find();
  res.status(200).json(products);
});

router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findProduct(id);
      if (product) {
        res.status(200).json(product)
      } else {
        res.status(404).json({
          message: "Not Found"
        })
      }
    } catch (error) {
      next(error);
    }
  })

// POST -- Create Product

router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const newProduct = await service.create(body);
    if (newProduct) {
      res.status(201).json(newProduct);
    } else {
      res.status(404).json({
        message: "Fatal error"
      })
    }

  })

// Patch
router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.status(200).json(product);
    } catch (error) {
      next(error)
    }
  })

// PUT
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.status(200).json(product);
  } catch (error) {
    next(error)
  }
})

// DELETE

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await service.delete(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
})

module.exports = router;
```

## Consideraciones para el envio a Produccion

- Cors: Evaluacion de acceso a quienes hacen las solicitudes.
- Https: La api debe estar desplegada en un servidor https ya que es mas seguro.
- Proceso de Build: Se debera correr antes de produccion.
- Logs: A produccion no se debe enviar los logs.
- Seguridad (Helmet): Es esencial.
- Testin: Seria ideal correr pruebas unitarias.

## Integracion de Cors

- `npm i cors`
- Se agrega al index.js con la siguiente logica, para permitiro que solo los que esten en la whiteList hagan el llamado:
  -/index.js

```
const whiteList = ['http://localhost:3002', 'http://127.0.0.1:5500'];
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
```

## Deployment Heroku

- Instalar Heroku CLI `curl https://cli-assets.heroku.com/install.sh | sh`.
- Login: `heroku login -i`.
- crear proyecto: `heroku create`.

### Configuracion para deploy

- Se agrega el siguiente escript al package.js donde se especifica la version de node usada
- /package.json

```
  "engines": {
   "node": "16.13.1"
  }
```

#### Especificar el puerto de forma dinamica:

- Se modifica la logica en el port que se utiliza:
- /index.js

```
const port = process.env.PORT ||3000;
```

- Se crea el archivo Procfile en la raiz del proyecto.
  /Procfile

```
web: npm run start

```

### DEPLOY

- `git push heroku master\main.`

# Base de datos con PostgresSQL

## Instalacion Docker

- Estos son los pasos para instalarlo dentro de Ubuntu sin embargo también puedes ver directamente https://docs.docker.com/engine/install/ubuntu/

- `sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ gnupg \ lsb-release`
- `sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ gnupg \ lsb-release`
- `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`
- `echo \ "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \ $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
- `sudo apt-get update sudo apt-get install docker-ce docker-ce-cli containerd.io`
- `sudo groupadd docker sudo usermod -aG docker $USER`

### Install Docker compose

- `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
- `sudo chmod +x /usr/local/bin/docker-compose`

## Configuración de Postgres en Docker

- Documentacion oficial: https://hub.docker.com/_/postgres
- Se crea el archivo `docker-compose.yml` en la raiz del proyecto y se agrega la siguiente configuracion.
- /docker-compose.yml

```
version: '3.3'

services:
  postgres-db:
    image: postgres:13
    environment:
      - POSTGRES_DB=YourStore
      - POSTGRES_USER=jzlbornoz
      - POSTGRES_PASSWORD=fatima17
    ports:
      -5432:5432

```

- Se levanta el contenedor que corre a Postgress: `sudo docker-compose up -d postgres-db`.
- Inspeccionar: `sudo docker-compose ps`
- Cancelar Proceso: `sudo docker-compose down`

### Persistencia de Datos: Volumes

- Se crea el directorio `postgres_data` en donde van a vivir los datos
- Se agrega la siguinete configuracion a `docker-compose.yml`.
- /docker-compose.yml

```
version: '3.3'

services:
  postgres-db:
    image: postgres:13
    environment:
      - POSTGRES_DB=YourStore
      - POSTGRES_USER=jzlbornoz
      - POSTGRES_PASSWORD=fatima17
    ports:
      - 5432:5432
    volumes:
      -./postgres_data:/var/lib/postgresql/data
```

### Interfas grafica para PostgreSql

- Se agrega en el `docker-compose.yml`
- /docker-compose.yml

```
 pgadmin:
    image: dpage/pgadmin4
    environment:
      - PGADMIN_DEFAULT_MAIL=admin@mail.com
      - PGADMIN_DEFAULT_PASSWORD=admin123
    ports:
      - 5050:80

```

- `docker-compose up -d pgadmin` para abrir la instancia de la interfaz en el navegador.
- Se crea el server por la interfaz.
  - HostName/ Address: Nombre del servicio en este caso: `postgres-db`
  - Maintenance data base: POSTGRES_DB= en este caso: YourStore
  - Username: POSTGRES_USER= en este caso: jzlbornoz
  - Password: POSTGRES_PASSWORD= en este caso: fatima17
- Se crea la primera tabla, con la queryTool:

```
CREATE TABLE task (
	id serial PRIMARY KEY,
	title VARCHAR ( 250 ) NOT NULL,
	completed boolean DEFAULT false
);
```

- `psql -h localhost -d YourStore -U jzlbornoz` logear por terminal.

## Integración de node-postgres

- Se instala la dependencia `npm install pg`.
- Se crea el directorio 'libs' en la raiz del proyecto en donde va a vivir la conexion a postgres.
- /libs/postgres.js

```
const { Client } = require('pg');

async function getConnection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'jzlbornoz',
    password: 'fatima17',
    database: 'YourStore'
  });

  await client.connect();
  console.log(client);
  return client
}

module.exports = getConnection;

```

- En el user services se agrega la logica utilizando el getConnection().
- /services/users.services.js

```
async getUsers() {
    const client = await getConnection();
    const rta = await client.query('SELECT * FROM task');
    return rta.rows;
  }
```

## Manejo del Pool de conexiones

- Se crea el modulo en el direcotio libs.
- /libs/postgres.pool.js

```
const { Pool } = require('pg');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'jzlbornoz',
    password: 'fatima17',
    database: 'YourStore'
  });

module.exports = pool;

```

- Se agrega la logica al servicio del products
- /services/products.services.js

```
const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');
const pool = require('../libs/postgres.pool');

class ProductsServices {
  constructor() {
    this.products = [];
    this.generate();
    this.pool = pool;
    this.pool.on('error', (error) => console.log(error));
  }
  ....
  ....
  ....
  ....
    async find() {
    const query = "SELECT * FROM task";
    const rta = await this.pool.query(query);
    return rta.rows;
  }
  ....
  ...
  ..
```
