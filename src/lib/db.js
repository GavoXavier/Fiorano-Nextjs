import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,      // Loaded automatically from .env.local
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Default MySQL/MariaDB port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
