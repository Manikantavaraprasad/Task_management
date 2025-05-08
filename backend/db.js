const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('PostgreSQL Connected...');
    client.release(); // release back to pool
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
};

module.exports = { connectDB, pool };
