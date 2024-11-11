const mysql = require('mysql2');
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.HOST_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_MAIN_NAME,
  port: process.env.DB_PORT,
  multipleStatements: true, // เปิดใช้งาน multiple statements
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database.');
});

module.exports = connection;
