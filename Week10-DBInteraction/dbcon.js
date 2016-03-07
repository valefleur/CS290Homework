//npm install mysql --save

var mysql = require("mysql");
var pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "student",
    password: "default",
    database: "todo"
});

module.exports.pool = pool;