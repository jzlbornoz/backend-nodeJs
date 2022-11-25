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

## Variables de ambiente en Node.js

- Se crea el directorio config y se agregan las variables.
- /config/config.js`

```
const config = {
	env: process.env.NODE_ENV || 'dev',
	port: process.env.PORT || 3000,
	dbUser: process.env.DB_USER,
	dbPassword: process.env.DB_PASSWORD,
	dbHost: process.env.DB_HOST,
	dbPort: process.env.DB_PORT,
	dbName: process.env.DB_NAME,
};

module.exports = { config };
```

- Se exporta a 'postgres.pool.js'.
- /libs/postgres.pool.js

```
const { Pool } = require('pg');
const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const pool = new Pool({ connectionString: URI });

module.exports = pool;
```

- Se crea el archivo .env en la raiz del proyecto.
- /.env

```
// Datos de ejemplo
PORT = 3000
DB_USER='juan'
DB_PASSWORD='admin123'
DB_HOST='localhost'
DB_NAME='my_store'
DB_PORT='5432'
```

- se instala `npm i dotenv` para poder leer las .env
- /config/config.js

```
require('dotenv').config();
```

## ORM: Instalación y configuración de Sequelize ORM

- ORM: Object Relational Mapping es un modelo de programación que permite mapear las estructuras de una base de datos relacionales.
- Los beneficios son los siguientes:
  Acciones como CRUD (Create, Read, Update, Delete) son administradas mediante ORM.
  La implementación de seeds o semillas, nos permiten recuperar, mediante código, la estructura de una BD.
- `npm install --save sequelize`
- `npm install --save pg-hstore`
- Se crea el archivo de configuracion 'sequelize' en el directorio /libs y se agrega la siguiente configuracion:

```
const { Sequelize } = require('sequelize');

const { config } = require('../config/config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI , {
  dialect: 'postgres',
  logging: true
});

module.exports = sequelize;
```

- Se agrega la configuracion al servicio de products:
- /services/product.services.js

```
const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');
const sequelize = require('../libs/sequelize');
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
        isBlock: faker.datatype.boolean(),
      })
    }
    ....
    ...
    ..
    .
     async find() {
    const query = "SELECT * FROM task";
    const [data] = await sequelize.query(query);
    return {
      data
    };
  }
```

## Modelo Sequelize

- Este es el esquema de la base de datos como tal.
- Se crea el directorio de la base de datos 'db' en el que va a contener los archivos modelos en su propio directorio dentro de 'db'.
- /db/model/user.model.js

```
const {Model , DataTypes , Sequelize} = require('sequelize');

const USERS_TABLE = 'users';

const userSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  }
}

class User extends Model {
  static associate() {
    //
  }
  static config(sequelize){
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = {USERS_TABLE , userSchema, User }

```

- /db/models/index.js

```
const {User, userSchema} = require('./user.model');

function setUpModel(sequelize) {
  User.init(userSchema , User.config(sequelize));
}

module.exports = setUpModel;

```

- /libs/sequelize.js

```
const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const  setUpModel = require('../db/models');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;

const sequelize = new Sequelize(URI , {
  dialect: 'postgres',
  logging: true
});

setUpModel(sequelize);

module.exports = sequelize;
```

- /services/users.services.js

```
  const { models } = require('../libs/sequelize');

async getUsers() {
    const rta = await models.User.findAll();
    return rta;
  }
```

## Culminando el CRUD

- Se agrega la logica al servicio para utilizar el orm
- /users.services.js

```
const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');


class usersService {
  constructor() {}

  async getUsers() {
    const rta = await models.User.findAll();
    return rta;
  }
  async getUser(id) {
   const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound("User do not Exist");
    }
    return user;
  }
  async createUser(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }
  async updateUser(id, update) {
    const user = await this.getUser(id);
    const rta = await user.update(update);
    return rta;
  }
  async deleteUser(id) {
    const user = await this.getUser(id);
    await user.destroy();
    return {id};
  }
}

module.exports = usersService;
```

- Se agrega un middleware para la captura de los errores de sequelize:
- /middlewares/error.handler.js

```
const { ValidationError } = require("sequelize");
.....
....
...
..
.
function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      massage: err.name,
      errors: err.errors
    })
  }
  next(err);
}
```

- /index

```
myApp.use(ormErrorHandler);
```

## Cambiando la base de datos a MySql

- Se agregan los servicios de mysql y phpmyadmin en el docker-compose:
- /docker-compose.yml

```
mysql-db:
    image: mysql:5
    environment:
      - MYSQL_DATABASE=YourStore
      - MYSQL_USER=jzlbornoz
      - MYSQL_ROOT_PASSWORD=fatima17
      - MYSQL_PORT=3306
    ports:
      - 3306:3306
    volumes:
      - ./mysql_data:/var/lib/mysql
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      - MYSQL_ROOT_PASSWORD=fatima17
      - PMA_HOST=mysql-db
    ports:
      - 8080:80

```

- `npm i --save mysql2`
- Para cambiar de motor de db se tiene que modificar el .env y el dialect en /libs/sequelize.js

## Migraciones

- Django: Las migraciones son la forma en que Django propaga cambios en los modelos y los refleja en el esquema de bases de datos.
- Laravel: Las migraciones son como un sistema de control de versiones para la base de datos.
- Sequelize: Es como un sistema de control de versiones para manejar los cambios desde el código y trackear los cambios en la base de datos.

## Migraciones en Sequelize ORM

- Actualmente la creacion de las tablas se hace mediante al sequelize.sync() en '/libs/sequelize.js', esta funcion lee los modelos para posteriormente crear las tablas, por esa razon no es aconsejable utilizarla en produccion, lo recomendable al correr migraciones es lo siguiente:

  - `npm i sequelize-cli -D`
  - Se agrega el archivo de configuracion:
  - /.sequelizerc

  ```
  module.exports = {
  'config': './db/config.js',
  'models-paths': './db/models',
  'migrations-paths': './db/migrations',
  'seeders-path': './db/seeders',
  }
  ```

  - Se crean los directorios de dicha configuracion y el archivo en si.
  - /db/config.js

  ```
  const { config } = require('../config/config');
  const USER = encodeURIComponent(config.dbUser);
  const PASSWORD = encodeURIComponent(config.dbPassword);
  const URI = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`;
  module.exports = {
  development: {
  url: URI,
  dialect: 'postgres'
  },
  production: {
  url: URI,
  dialect: 'postgres'
  },
  }
  ```

## Configurando y corriendo migraciones con npm scripts

- Se crean los scripts para llevar a cabo las tareas:
- /package.json

```
"scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "migrations:generate": "sequelize-cli migration:generate --name"
  },

```

- Al correr `npm run migrations:generate create-user` se creara un archivo en el directorio asignado '/db/migrations/ donde tiene una pieza de codigo que recibira indicaciones para la migracion'.
- Se elimina el `sequelize.sync();` en '/libs/sequelize.js.
- /db/migrations/timestamp-create-users.js

```
'use strict';

/** @type {import('sequelize-cli').Migration} */

const { USERS_TABLE, userSchema } = require('../models/user.model')

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable(USERS_TABLE, userSchema);
  },

  async down(queryInterface,) {
    await queryInterface.drop(USERS_TABLE);
  }
};

```

- Se agregan el resto de scritps al package.json

```
"scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "migrations:generate": "sequelize-cli migration:generate --name",
    "migrations:run": "sequelize-cli db:migrate",
    "migrations:revert": "sequelize-cle db:migrate:undo",
    "migrations:delete": "sequelize-cle db:migrate:undo:all"
  },
```

- Para poder correr la migracion se eliminan todas las tablas antiguas, posteriormente en consola se corre `npm run migration:run`

## Modificaciones de entidades

- Si se hizo una modificacion a una entidad, es necesario hacer una migracion exclusiva.
- Se genera la migracion `npm run migrations:generate name(en este caso add-role)` y se agrega la configuracion en el archivo generado.
- /db/migrations/datestamp-addrole.js

```
'use strict';

/** @type {import('sequelize-cli').Migration} */


const { USERS_TABLE, userSchema } = require('../models/user.model')

module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn(USERS_TABLE, 'role', userSchema.role);
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(USERS_TABLE, 'role');
  }
};

```

## Relaciones 1-1

- Sequelize tiene dos metodos que permiten expresar este tipo de relaciones:
  - HasOne: Se utiliza cuando se quiere que la segunda entidad cargue con la relacion.
  - BelongsTo: Permite que sea la entidad "A" la que carga con la relacion.
- Las relaciones se definen en el metodo associate() del modelo.
- db/models/costumers.model.js

```
class Costumer extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: COSTUMERS_TABLE,
      modelName: 'Costumer',
      timestamps: false
    }
  }
}
```

- db/models/index.js

```
function setUpModel(sequelize) {
  User.init(userSchema, User.config(sequelize));
  Costumer.init(costumerSchema, Costumer.config(sequelize));
  Product.init(productsSchema, Product.config(sequelize));
  Categorie.init(categorieSchema, Categorie.config(sequelize));

  //Relaciones
  Costumer.associate(sequelize.models);
}

```

- Se agrega la FK al costumerSchema
- /db/models/costumers.model.js

```
const costumerSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
  },
  lastName: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: false,
    field: 'last_name'
  },
  phone: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  },
  //FK
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USERS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL'
  }
}
```

- Se hace la migracion.
- Se modifica el schema de validacion:
- /schemas/costumer.schema.js

```
const createCostumerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  userId: userId.required()
})

const updateCostumerSchema = Joi.object({
  name: name,
  lastName: lastName,
  phone: phone,
  userId: userId,
})

```

### Resolviendo la Relacion

- Se agrega que la fk sea unica en el costumers.model.js

```
//FK
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: USERS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL'
  }
```

- Se hace la migracion de los cambios:

```
'use strict';

/** @type {import('sequelize-cli').Migration} */

const { COSTUMERS_TABLE } = require('../models/costumers.model');
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn(COSTUMERS_TABLE, 'user_id', {
      field: 'user_id',
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: true,
    });
  },

  async down(queryInterface,) {
   // await queryInterface.dropTable(COSTUMERS_TABLE);
  }
};

```

- Se hace la respuesta anidada en el servicio
- /services/costumer.services.js

```
  async getCostumers() {
    const rta = await models.Costumer.findAll({
      include: ['user'] // es el alias que se le pone en la associate del model
    });
    return rta;
  }
```

- Se requiere que la relacion se bidimencional, es decir que cuando haga el llamado a user venga anidado el costumer.
- Se agrega el associate en el user.model con el metodo hasOne().
- db/models/user.model.js

```
static associate(models) {
    this.hasOne(models.Costumer, {
      as: 'costumer',
      foreignKey: 'user_id'
    });
  }
```

- finalmente se agrega el anidado en el servicio.
- services/users.service.js

```
async getUsers() {
    const rta = await models.User.findAll({
      include: ['costumer']
    });
    return rta;
  }
```

- Para hacer que al crear un costumer se cree el usuario en el mismo endpoint se agrega la siguinete configuracion.
- Se modifica el schema de costumers.
- schemas/costumers.schema.js

```
const createCostumerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  phone: phone.required(),
  user: Joi.object({
    email: email.required(),
    password: password.required(),
    age: age.required(),
    nacionality: nacionality.required(),
    role: role.required(),
  })
})
```

- Se resuelve el servicio

```
async createCostumer(data) {
    const newCostumer = await models.Costumer.create(data , {
      include: ['user']
    });
    return newCostumer;
  }
```

## Relaciones 1-N

- Sequelize proporciona un metodo en el cual se puede trabajar dicha relacion "hasMany".
- Se agrega la FK y la relacion en el modelo de products
- db/models/products.model.js

```
//FK
   categoryId: {
    field: 'category_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORIES_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelet: 'SET NULL'
  }
```

```
 class Product extends Model {
 static associate(models) {
   this.belongsTo(models.Categorie, { as: 'category' })
 }
 static config(sequelize) {
   return {
     sequelize,
     tableName: PRODUCTS_TABLE,
     modelName: 'Product',
     timestamps: false
   }
 }
}
```

- Se agre la associate en el modelo Categorie.
- db/models/categories.model.js

```
class Categorie extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORIES_TABLE,
      modelName: 'Categorie',
      timestamps: false
    }
  }
}
```

- Se corre la migracion con la nueva configuracion de las tablas.

### Resolviendo Relacion 1-N

- Se agrega el include en cada servicio deseado.
- /services/products.services.js

```
async find() {
    const rta = await models.Product.findAll({
      include: ['category'] // es el nombre que se le pone en el associate del model {as: 'category}
    });
    return rta;
  }
```

- /services/categories.services.js

```
  async findCategorie(id) {
    const categorie = await models.Categorie.findByPk(id , {
      include: ['products'] // es el nombre que se le pone en el associate del model {as: 'products'}
    });
    if (!categorie) {
      throw boom.notFound("Categorie Not Found");
    }
    return categorie;
  }
```

## Ordenes de Compra

- Se crea la tabla de Order.
- db/models/orders.model.js

```
const { DataTypes, Sequelize, Model } = require("sequelize");
const {COSTUMERS_TABLE} = require("./costumers.model")

const ORDER_TABLE = 'orders';

const OrderSchema = {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	customerId: {
		field: 'customer_id',
		allowNull: false,
		type: DataTypes.INTEGER,
		References: {
			model: COSTUMERS_TABLE,
			key: 'id',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
	createdAt: {
		allowNull: false,
		type: DataTypes.DATE,
		field: 'created_at',
		defaultValue: Sequelize.NOW,
	},
};

class Order extends Model {
	static associate(models) {
		this.belongsTo(models.Customer, {
			as: 'customer',
		});
	}

	static config(sequelize) {
		return {
			sequelize,
			tableName: ORDER_TABLE,
			modelName: 'Order',
			timestamps: false,
		};
	}
}

module.exports = { Order, OrderSchema, ORDER_TABLE };

```

- Se agrega la asociacion en el costumer model.
- db/models/costumers.model.js

```
class Costumer extends Model {
  // static permite que los metodos sean llamados sin necesidad de una instancia.
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
    this.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'costumerId'
    })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: COSTUMERS_TABLE,
      modelName: 'Costumer',
      timestamps: false
    }
  }
}
```

- Se hace el setUp de la tabla en el index.js de models para posteriormente correr la migracion.
- Se crea el router de orders.
- routes/order.router.js

```
const express = require('express');

const OrderService = require('../services/order.service');
const validatorHandler = require('../middlewares/validator.handler');
const {
	getOrderSchema,
	createOrderSchema,
} = require('../schemas/order.schema');

const router = express.Router();
const service = new OrderService();

router.get(
	'/:id',
	validatorHandler(getOrderSchema, 'params'),
	async (req, res, next) => {
		try {
			const { id } = req.params;
			const order = await service.findOne(id);
			res.json(order);
		} catch (error) {
			next(error);
		}
	}
);

router.post(
	'/',
	validatorHandler(createOrderSchema, 'body'),
	async (req, res, next) => {
		try {
			const body = req.body;
			const newOrder = await service.create(body);
			res.status(201).json({ newOrder });
		} catch (error) {
			next(error);
		}
	}
);

module.exports = router;
```

- Se crea el servicio de ordenes.
- services/order.services.js

```
const boom = require('@hapi/boom');

const { models } = require('./../libs/sequelize');

class OrderServices {
	constructor() {
	}

	async create(data) {
		const newOrder = await models.Order.create(data);
		return newOrder;
	}

	async find() {
		return [];
	}

	async findOne(id) {
		const order = await models.Order.findByPk(id, {
			include: [
				{
					association: 'costumer',
					include: ['user'],
				},
			],
		});
    if(!order) {
      throw boom.notFound("Order does not exist");
    }
		return order;
	}

	async update(id, changes) {
		return {
			id,
			changes,
		};
	}

	async delete(id) {
		return { id };
	}
}

module.exports = OrderServices;
```

- Se crea el schema de validacion con joi
- schemas/order.schema.js

```
const Joi = require('joi');

const id = Joi.number().integer()
const customerId = Joi.number().integer();


const getOrderSchema = Joi.object({
	id: id.required(),
})

const createOrderSchema = Joi.object({
	customerId: customerId.required(),
});

module.exports = {
	getOrderSchema,
	createOrderSchema
}
```
