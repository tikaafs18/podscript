// const mysql = require('mysql');

// const dbConf = mysql.createPool({
//     // host: 'localhost',
//     // user:'tika',
//     // password:'Nurfatihasj18',
//     // database:'dbpersonalproject'
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// module.exports = { dbConf };

const mysql = require('mysql');
const util = require('util');

const dbConf = mysql.createPool({
    // user: process.env.DB_USER,
    // host: process.env.DB_HOST,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DATABASE
    host: 'localhost',
    user: 'tika',
    password: 'Nurfatihasj18',
    database: 'dbpersonalproject'
});

const dbQuery = util.promisify(dbConf.query).bind(dbConf);

module.exports = { dbConf, dbQuery }
