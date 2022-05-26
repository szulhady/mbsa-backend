const mysql = require("mysql");

// const connection = mysql.createPool ({
//   host: "68.183.189.84",
//   user: "root",
//   password: "password",
//   database: "mbsa",
//   port: 3306,
// });
const connection = mysql.createPool ({
  host: "178.128.29.241",
  user: "root",
  password: "password",
  database: "mbsa",
  port: 3306,
});

module.exports = connection;