const { Pool } = require("pg");

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : undefined
);

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      user_name TEXT NOT NULL,
      added TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getMessages() {
  const { rows } = await pool.query(
    `
      SELECT id, text, user_name AS user, added
      FROM messages
      ORDER BY added DESC
    `
  );
  return rows;
}

async function addMessage(user, text) {
  await pool.query(
    `
      INSERT INTO messages (user_name, text)
      VALUES ($1, $2)
    `,
    [user, text]
  );
}

module.exports = {
  initDb,
  getMessages,
  addMessage,
};
