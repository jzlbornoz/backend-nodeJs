const { Pool } = require('pg');

  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'jzlbornoz',
    password: 'fatima17',
    database: 'YourStore'
  });

module.exports = pool;
