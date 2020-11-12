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
  host: 'lab-db.ca2edemxewbg.us-east-1.rds.amazonaws.com',
  port: '3306',
  user: 'new_master_chris',
  password: '', //Wouldn't you like to know!
  database: 'maskeraid'
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



//Password hash function
const hash = pass => crypto.scryptSync(pass, salt, 64).toString('hex');

//Get the user ID from a session cookie
const idFromCookie = cookie => cookie.substring(0, cookie.indexOf(":"));

//Change a user password
function setUserPassword(userID, pass, r ) {
	connection.query(`UPDATE user SET password = '${hash(pass)}' WHERE userID = ${userID} AND locked != 1`,
	(err, rows, fields) => {
		if (err) throw err;
		else r();
	});
}

//Verify username and password
function verifyPassword( email, pass, r ) {
	connection.query("SELECT userID, password FROM user WHERE locked IS NOT 1 AND email =" + email, 
	(err, rows, fields) => {
		if (err) throw err;

		if (rows.length !== 1 || rows[0].password !== hash(req.body.password)) r(-1, false);
		else r(rows[0].userID, true);
	});
};

//Generate a session cookie
function generateCookie(id, r) {
	const cookie = id + ":" + randstr.generate();
	connection.query(`UPDATE user SET cookie = '${cookie}', sessionExpiration = now() + INTERVAL 1 DAY WHERE userID = ${id}`, function (err, rows, fields) {
		if (err) throw err;
		else r(cookie);
	});
};

//Verify a session cookie
function verifyCookie(cookie, r) {
	connection.query(`SELECT userID FROM user WHERE locked IS NOT 1 AND sessionExpiration > now() AND cookie = ${cookie}`, 
	(err, rows, fields) => {
		if (rows.length !== 1) r(false);
		else r(true);
	});
};

//Update a user's account details
function updateUserAccount(id, args, r) {
	const updateEmail = () => {
		if (typeof args.email_new === "undefined") return;

		connection.query(`UPDATE user SET email = '${args.email_new}' WHERE userID = ${id} AND locked != 1`,
		(err, rows, fields) => {
			if (err) throw err;;
		});
	};

	const updatePassword = () => {
		if (typeof args.password_new === "undefined") return;

		setUserPassword(id, args.password_new, () => {});
	};
	
	const updateName = () => {
		if (typeof args.name === "undefined") return;
		
		connection.query(`UPDATE user SET name = '${args.name}' WHERE userID = ${id} AND locked != 1`,
		(err, rows, fields) => {
			if (err) throw err;
			console.log("name updated");
		});
	};

	const updatePhone = () => {
		if (typeof args.phone === "undefined") return;

		connection.query(`UPDATE user SET phone = '${args.phone}' WHERE userID = ${id} AND locked != 1`,
		(err, rows, fields) => {
			if (err) throw err;
		});
	};

	const updateCountry = () => {
		if (typeof args.country === "undefined") { return; }

		connection.query(`UPDATE user SET country = '${args.country}' WHERE userID = ${id} AND locked != 1`,
		(err, rows, fields) => {
			if (err) throw err;
		});
	};

	updateEmail();
	updatePassword();
	updateName();
	updatePhone();
	updateCountry();
	r();

};

//GET /reset
app.get('/command/:comm', (req, res) => {
	//DO NOT forget to delete this before submitting
	connection.query(req.params.comm, 
	function (err, rows, fields) {
		if (err) res.status(400).send( err );
		else res.status(200).send(JSON.stringify(rows));
	});

});

app.post('/test', (req, res) => {
	//DO NOT forget to delete this before submitting
	res.status(200).send(req.body);
});

//POST /login
app.post('/login', (req, res) => {
	//Check if the username and password are valid
	verifyPassword(req.body.email, req.body.password, (id, valid) => {
		if (!valid) res.status(401).send();
		else generateCookie(id, (cookie) => res.status(200).send(cookie));
	});
});

//POST /account
app.post('/account', (req, res) => {
	
	console.log(req.body);

	const empty = v => typeof v === "undefined" || v === "";

	//Check if the email, password and type fields are not blank
	if (empty(req.body.email) || empty(req.body.password) || empty(req.body.type)) {
		res.status(400).send();
		return;
	} else if (Number(req.body.type) > 3 || Number(req.body.type) < 1) {
		res.status(400).send("invalid_type");
		return;
	};

	//Check if the email is unique
	connection.query(`SELECT * FROM user WHERE email = '${req.body.email}'`, function (err, rows, fields) {
		if (err) throw err;
		if (rows.length > 0) {
			res.status(403).send("email_registered");
			return;
		} else {
			//Add the user
			connection.query(`INSERT INTO user (email, password, type_typeID) VALUES ('${req.body.email}', '${hash(req.body.password)}', ${Number(req.body.type)})`, 
			(err, rows, fields) => {
				if (err) throw err;
				else {
					connection.query(`SELECT userID FROM user WHERE email = '${req.body.email}'`, (err, rows, fields) => {
						if (err) throw err;
						console.log(rows[0].userID);
						updateUserAccount(rows[0].userID, req.body, () => res.status(200).send("success"));
					});

				}
			});
		};
	});
	
});

//PUT /account
app.put('/account', (req, res) => {
	//Check if the cookie is valid
	verifyCookie(req.body.cookie, valid => {
		if (!valid) res.status(401).send();
		else {
			//Check if the password is valid
			verifyPassword(req.body.email, req.body.password, valid => {
				if (!valid) res.status(401).send();
				else {
					//Update user account
					updateUserAccount(req.body, success => {
						if (!success) res.status(500).send();
						else res.status(200).send();
					});					
				};
			});
		}
		
	});
});

//DELETE /account
app.delete('/account', (req, res) => {
	//Check if the cookie is valid
	verifyCookie(req.body.cookie, valid => {
		if (!valid) res.status(403).send();
		else {
			//Disable the user			
			connection.query(`UPDATE user SET locked = 1 WHERE cookie = ${req.body.cookie}`,
			(err, rows, fields) => {
				if (err) throw err;
				res.status(200).send();
			});
		}
	});
});

//GET /account/{accountID}
app.get('/account/:id', (req, res) => {
	connection.query(`SELECT email, typeName, name, phone, streetAddress, state, country, zip FROM user LEFT JOIN type ON user.type_typeID = type.typeID LEFT JOIN user_has_address ON user.userID = user_has_address.user_userID LEFT JOIN address ON user_has_address.address_id = address.id WHERE userID = ${req.params.id} AND locked != 1`, function (err, rows, fields) {
		if (err) throw err;
		
		res.status(200).send(JSON.stringify(rows));
	});
});

//connecting the express object to listen on a particular port as defined in the config object.
app.listen(config.port, config.host, (e) => {
  if (e) {
    throw new Error('Internal Server Error');
  }
  logger.info(`${config.name} running on ${config.host}:${config.port}`);
});
