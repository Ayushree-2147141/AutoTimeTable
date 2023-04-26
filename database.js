var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'autotimetable',
    user: 'root',
    password: 'root'
});

module.exports = connection;