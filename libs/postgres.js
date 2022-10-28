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
