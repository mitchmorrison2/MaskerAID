const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const crypto = require('crypto');
const randstr = require("randomstring");
const { log, ExpressAPILogMiddleware } = require('@rama41222/node-logger');

//Salt for password hashing
const salt = "wtfThisIsn'tRandom";

//mysql connection
var connection = mysql.createConnection({
  host: 'backend-db',
  port: '3306',
  user: 'manager',
  password: 'Password',
  database: 'db'
});

//set up some configs for express.
const config = {
  name: 'sample-express-app',
  port: 8000,
  host: '0.0.0.0',
};

//create the express.js object
const app = express();

//create a logger object.  Using logger is preferable to simply writing to the console.
const logger = log({ console: true, file: false, label: config.name });

app.use(bodyParser.json());
app.use(cors({
  origin: '*'
}));
app.use(ExpressAPILogMiddleware(logger, { request: true }));

//Attempting to connect to the database.
connection.connect(function (err) {
  if (err)
    logger.error("Cannot connect to DB!");
  logger.info("Connected to the DB!");
});

//POST /login
app.post('/login', (req, res) => {
	let valid = false;
	let id = 0;
	
	//Check if the username and password are valid
	connection.query("SELECT userID, password FROM user WHERE email = " + req.param.email, 
	function (err, rows, fields) {
		if (err) throw err;
		
		const hash = crypto.scryptSync(req.param.password, salt, 64);
		if (rows[0].password === hash) valid = true;
		else {
			res.status(401).send();
			return;
		}

		id = rows[0].userID;
	});

	//Generate a cookie
	const cookie = id + ":" randstr.generate();
	connection.query("UPDATE user SET cookie = $(cookie), sessionExpiration = now() + INTERVAL 1 DAY WHERE email = $(req.param.email)", function (err, rows, fields) {
		if (err) throw err;

		res.status(200).send(cookie);
	}
});

//POST /account
app.post('/account', (req, res) => {
	//TODO
});

//GET /account/{accountID}
app.get('/account/:id', (req, res) => {
	let validCookie = false;
	//TODO
});

//PUT /account/{accountID}
app.put('/account/:id', (req, res) => {
	let validCookie = false;
	//TODO
});

//GET /account/{accountID}
app.delete('/account/:id', (req, res) => {
	let validCookie = false;
	//TODO
});

//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
