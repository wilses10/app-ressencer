const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'bandjoun2024',
  database: process.env.DB_NAME || 'recensement_bandjoun',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initDB() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'recensement_bandjoun'}\``);
    await conn.query(`CREATE TABLE IF NOT EXISTS \`${process.env.DB_NAME || 'recensement_bandjoun'}\`.habitants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nom VARCHAR(100) NOT NULL,
      prenom VARCHAR(100) NOT NULL,
      quartier VARCHAR(150) NOT NULL,
      age INT NOT NULL CHECK (age > 0 AND age < 150),
      metier VARCHAR(100) NULL,
      date_inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log('Base de données initialisée avec succès');
  } finally {
    conn.release();
  }
}

module.exports = { pool, initDB };