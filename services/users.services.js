const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');
const getConnection = require('../libs/postgres');


class usersService {
  constructor() {
    this.users = [];
    this.generate();

  }
  generate() {
    this.users.push({
      name: "admin",
      age: 18,
      nacionality: "Venezuela",
      id: faker.datatype.uuid(),
    })
  }
  async getUsers() {
    const client = await getConnection();
    const rta = await client.query('SELECT * FROM task');
    return rta.rows;
  }
  getUser(id) {
    const user = this.users.find(item => item.id === id);
    if (!user) {
      throw boom.notFound("User do not Exist");
    }
    return user;
  }
  createUser(data) {
    const newUser = {
      ...data,
      id: faker.datatype.uuid(),
    }
    this.users.push(newUser);
    return newUser;
  }
  updateUser(id, update) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound("User do not Exist");
    }
    const userToUpdate = this.users[index];
    this.users[index] = {
      ...userToUpdate,
      ...update,
    }
    return this.users[index];
  }
  deleteUser(id) {
    const index = this.users.findIndex(item => item.id === id);
    if (index === -1) {
      throw boom.notFound("User do not Exist");
    }
    this.users.splice(index, 1);
    return {
      message: `User: ${id} deleted`
    }
  }
}

module.exports = usersService;
