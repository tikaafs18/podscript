const mysql = require('mysql');
const util = require('util');

const dbConf = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const dbQuery = util.promisify(dbConf.query).bind(dbConf);

module.exports = { dbConf, dbQuery }
