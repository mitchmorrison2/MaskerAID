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
	let id = 0;
	let stop = false;
	
	//Check if the username and password are valid
	connection.query("SELECT userID, password FROM user WHERE locked IS NOT 1 AND email = " + req.body.email, 
	function (err, rows, fields) {
		if (err) throw err;
		
		const hash = crypto.scryptSync(req.body.password, salt, 64);
		if (rows.length === 0 || rows[0].password !== hash) {
			res.status(401).send();
			stop = true;
			return;
		}

		id = rows[0].userID;
	});

	if (stop) return;

	//Generate a cookie
	const cookie = id + ":" randstr.generate();
	connection.query("UPDATE user SET cookie = $(cookie), sessionExpiration = now() + INTERVAL 1 DAY WHERE email = $(req.body.email)", function (err, rows, fields) {
		if (err) throw err;

		res.status(200).send(cookie);
	});
});

//POST /account
app.post('/account', (req, res) => {
	let stop = false;

	//Check if the email, password and type fields are not blank
	if (req.body.email === "" || req.body.password === "" || req.body.type === "") {
		res.status(400).send();
		stop = true;
	});

	if (stop) return;

	//Check if the email is unique
	connection.query("SELECT * FROM user WHERE email = $(req.body.email)", function (err, rows, fields) {
		if (err) throw err;
		if (rows.length >= 1) {
			res.status(403).send();
			stop = true;
		} 
	});

	if (stop) return;

	//Add the account info to the database
	const hash = crypto.scryptSync(req.body.password, salt, 64);
	const s = "\"" + req.body.email + "\"," +
		"\"" + hash + "\"," +
		"\"" + req.body.name + "\"," +
		"\"" + req.body.type + "\"," +
		"\"" + req.body.phone + "\"," +
		"\"" + req.body.addressLine1 + "\"," +
		"\"" + req.body.addressLine2 + "\"," +
		"\"" + req.body.territory + "\"," +
		"\"" + req.body.postalcode + "\"," +
		"\"" + req.body.country + "\")";
	connection.query("INSERT INTO user (email, password, name, type, phone, addressLine1, addressLine2, territory, postalcode, country) VALUES (" + s, function (err, rows, fields) {
		if (err) throw err;
		res.status(200).send();
	});
	
});

//GET /account/{accountID}
app.get('/account/:id', (req, res) => {
	connection.query("SELECT email, type, name, phone, addressLine1, addressLine2, state, country, postalcode FROM user WHERE locked IS NOT 1 AND userID = " + req.param.id, function (err, rows, fields) {
		if (err) throw err;
		
		res.status(200).send(JSON.stringify(rows));
	});
});

//PUT /account/{accountID}
app.put('/account/:id', (req, res) => {
	let stop = false;	

	//Check if the cookie and password are valid
	connection.query("SELECT cookie, password FROM user WHERE locked IS NOT 1 AND userID" + req.param.id, 
	function (err, rows, fields) {
		if (err) throw err;
		
		const hash = crypto.scryptSync(req.body.password, salt, 64);
		if (rows.length === 0 || rows[0].password !== hash || rows[0].cookie !== req.body.cookie) {
			res.status(401).send();
			stop = true;
			return;
		}
	});

	if (stop) return;

	//Add the account info to the database
	const hash = crypto.scryptSync(req.body.password_new, salt, 64); 
	let s = "email = \"" + req.body.email + "\"," +
		"name = \"" + req.body.name + "\"," +
		"phone = \"" + req.body.phone + "\"," +
		"addressLine1 = \"" + req.body.addressLine1 + "\"," +
		"addressLine2 = \"" + req.body.addressLine2 + "\"," +
		"territory = \"" + req.body.territory + "\"," +
		"postalcode = \"" + req.body.postalcode + "\"," +
		"country = \"" + req.body.country + "\"";

	if (password_new !== "") s += ", password = \"" + hash + "\"";

	connection.query("UPDATE user SET " + s + "WHERE userID = " + req.param.id, function (err, rows, fields) {
		if (err) throw err;
		res.status(200).send();
	});
});

//DELETE /account/{accountID}
app.delete('/account/:id', (req, res) => {
	let stop = false;

	//Check if the cookie and password are valid
	connection.query("SELECT cookie, password FROM user WHERE locked IS NOT 1 AND userID" + req.param.id, 
	function (err, rows, fields) {
		if (err) throw err;
		
		const hash = crypto.scryptSync(req.body.password, salt, 64);
		if (rows.length === 0 || rows[0].password !== hash || rows[0].cookie !== req.body.cookie) {
			res.status(401).send();
			stop = true;
			return;
		}
	});

	if (stop) return;

	//Disable the user
	connection.query("UPDATE user SET locked = 1 WHERE userID = $(req.body.cookie)",
	function (err, rows, fields) {
		if (err) throw err;
		res.status(200).send();
	});
});

//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
