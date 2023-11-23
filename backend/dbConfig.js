const mysql = require("mysql2/promise"); // Import mysql2 with promise support
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  connectionLimit: 10,
});

module.exports = pool;
