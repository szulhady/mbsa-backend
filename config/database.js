const mysql = require("mysql");

// const connection = mysql.createPool ({
//   host: "68.183.189.84",
//   user: "root",
//   password: "password",
//   database: "mbsa",
//   port: 3306,
// });
const connection = mysql.createPool ({
  host: "165.232.167.69",
  user: "root",
  password: "password",
  database: "mbsa",
  port: 3306,
});

module.exports = connection;