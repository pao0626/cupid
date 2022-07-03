require('dotenv').config();
const mysql = require('mysql2/promise');
const env = process.env.NODE_ENV || 'production';
const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT} = process.env;

const mysqlConfig = {
	production: { // for EC2 machine
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_DATABASE,
		port: DB_PORT
	},
	development: { // for localhost development
		host: DB_HOST,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_DATABASE,
		port: DB_PORT
	}
};

let mysqlEnv = mysqlConfig[env];
mysqlEnv.waitForConnections = true;
mysqlEnv.connectionLimit = 20;

const pool = mysql.createPool(mysqlEnv);

module.exports = {
	mysql,
	pool
};