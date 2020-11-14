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


//CORS lite Setup
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(ExpressAPILogMiddleware(logger, { request: true }));

//Attempting to connect to the database.
connection.connect(function (err) {
  if (err)
    logger.error("Cannot connect to DB!");
  logger.info("Connected to the DB!");
});



//Password hash function
const hash = pass => crypto.scryptSync(pass, salt, 64).toString('hex').substring(0,45);

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
	connection.query(`SELECT userID, password FROM user WHERE locked != 1 AND email = "${email}"`, 
	(err, rows, fields) => {
		if (err) throw err;

		if (rows.length !== 1 || rows[0].password !== hash(pass)) r(-1, false);
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
	if (typeof cookie === "undefined" || cookie === "") {
		r(false);
		return;
	};

	connection.query(`SELECT userID FROM user WHERE locked != 1 AND sessionExpiration > now() AND cookie = '${cookie}'`, 
	(err, rows, fields) => {
		if (err) throw err;
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
	updateUserAddress(id, args, r);

};

function updateUserAddress(id, args, r) {
	
	const empty = v => typeof v === "undefined" || v === "";
	const isNum = v => !isNaN(Number(v));

	let fields = "";
	let vals = "";

	if (!empty(args.streetAddress)) {
		fields = fields + ", streetAddress";
		vals = vals + ", " + args.streetAddress;
	}
	if (!empty(args.city)) {
		fields = fields + ", city";
		vals = vals + ", " + args.city;
	}
	if (!empty(args.state)) {
		fields = fields + ", state";
		vals = vals + ", " + args.state;
	}
	if (isNum(args.zip)) {
		fields = fields + ", zip";
		vals = vals + ", " + args.zip.toString();
	}

	if (fields === "") {
		r();
		return;
	};

	fields = "user_userID" + fields;
	vals = id.toString() + vals;

	connecion.query(`INSERT INTO address (${fields}) VALUES (${vals})`,
	(err, rows, fields) => {
		if (err) throw err;
	});

	r();

};

app.get('/command/:comm', (req, res) => {
	//DO NOT forget to delete this before submitting
	connection.query(req.params.comm, 
	function (err, rows, fields) {
		if (err) res.status(400).send( err );
		else res.status(200).send(JSON.stringify(rows));
	});

});

//POST /login
app.post('/login', (req, res) => {
	//Check if the username and password are valid
	verifyPassword(req.body.email, req.body.password, (id, valid) => {
		if (!valid) res.status(401).send("invalid");
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
		if (!valid) res.status(401).send("invalid_cookie");
		else {
			//Check if the password is valid
			verifyPassword(req.body.email, req.body.password, valid => {
				if (!valid) res.status(401).send("invalid_password");
				else {
					//Update user account
					updateUserAccount(idFromCookie(req.body.cookie), req.body, () => {
						res.status(200).send("done");
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
			connection.query(`UPDATE user SET locked = 1 WHERE cookie = '${req.body.cookie}'`,
			(err, rows, fields) => {
				if (err) throw err;
				res.status(200).send();
			});
		}
	});
});

//GET /account/{accountID}
app.get('/account/:id', (req, res) => {
	connection.query(`SELECT email, typeName, name, phone, streetAddress, state, country, zip FROM user LEFT JOIN type ON user.type_typeID = type.typeID LEFT JOIN address ON user.userID = address.user_userID WHERE userID = ${req.params.id} AND locked != 1`, function (err, rows, fields) {
		if (err) throw err;
		
		res.status(200).send(JSON.stringify(rows));
	});
});

//GET /account/{accountID}/inventory
app.get('/account/:id/inventory', (req, res) => {
	connection.query(`SELECT * FROM listing WHERE user_userID = ${req.params.id}`, (err, rows, fields) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(rows));
	});
});

//GET /orders
app.get('/orders', (req, res) => {
	verifyCookie(req.body.cookie, valid => {
		if (!valid) {
			res.status(403).send("invalid_cookie");
			return;
		};

		connection.query(`SELECT * FROM orders WHERE user_userID = ${idFromCookie(req.body.cookie)}`, 
		(err, rows, fields) => {
			if (err) throw err; 
			else res.status(200).send(JSON.stringify(rows));
		});
	});
});

//GET /orders/{orderID}
app.get('/orders/:id', (req, res) => {
	connection.query(`SELECT * FROM orders WHERE transID = ${req.params.id}`, 
	(err, rows, fields) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(rows));
	});
});

//PUT /orders/{orderID}
app.put('/orders/:id', (req, res) => {
	const empty = v => typeof v === "undefined" || v === "";

	if (empty(req.body.stats) || isNaN(Number(req.params.id))) {
		res.status(400).send();
		return;
	}

	verifyCookie(req.body.cookie, valid => {
		if (!valid) {
			res.status(403).send("invalid_cookie");
			return;
		};

		let id = idFromCookie(req.body.cookie);

		connection.query(`UPDATE orders SET orderStatus = '${req.body.status}' WHERE (transID = ${req.params.id}) AND (buyerID = ${req.params.id} OR sellerID = ${req.params.id})`,
		(err, rows, fields) => {
			if (err) throw err; 
			else res.status(200).send(JSON.stringify(rows));
		});
	});
});

//GET /listings
app.get('/listings', (req, res) => {
	const empty = v => typeof v === "undefined" || v === "";
	const isNum = v => !isNaN(Number(v));

	let where = false;
	let query = 'SELECT listingID, email, productID, price, quantity FROM listing INNER JOIN user ON listing.user_userID = user.userID';
	if (!empty(req.body.country)) {
		query = query + (!where ? " WHERE " :" AND ") + `country = '${req.body.country}'`;
		where = true; 
	}
	if (isNum(req.body.quantity)) {
		query = query + (!where ? " WHERE " :" AND ") + `quantity > ${req.body.quantity}`;
		where = true; 
	} 
	if (isNum(req.body.product)) {
		query = query + (!where ? " WHERE " :" AND ") + `productID = ${req.body.product}`;
		where = true; 
	}
	let asc = req.body.order === "asc";
	switch(req.body.sortby) {
		case "alpha":
			query = query + " ORDER BY email " + (asc ? "ASC" : "DESC" );
			break;
		case "price":
			query = query + " ORDER BY price " + (asc ? "ASC" : "DESC" );
			break;
		case "quantity":
			query = query + " ORDER BY quantity " + (asc ? "ASC" : "DESC" );
			break;
	};

	console.log(query); 

	connection.query(query, (err, rows, fields) => {
		if (err) throw err;
		else {
			if (isNum(req.body.rownum) && isNum(req.body.limit)) {
				res.status(200).send(JSON.stringify(rows.split(req.body.rownum, req.body.rownum + req.body.limit)));
			} else {
				res.status(200).send(JSON.stringify(rows));
			};
		};
	});
});

//POST /listings
app.post('/listings', (req, res) => {
	verifyCookie(req.body.cookie, valid => {
		if (!valid) {
			res.status(403).send("invalid_cookie");
			return;
		};

		connection.query(`INSERT INTO listing (productID, price, quantity, user_userID) VALUES (${req.body.productID},${req.body.price},${req.body.quantity},${idFromCookie(req.body.cookie)})`,
		(err, rows, fields) => {
			if (err) throw err;
			res.status(200).send("success");
		});
	});
});

//GET /listings/{listingID}
app.get('/listings/:id', (req, res) => {
	connection.query(`SELECT * FROM listing WHERE listingID = ${req.params.id}`, 
	(err, rows, fields) => {
		if (err) throw err;
		if (rows.length === 0) res.status(404).send();
		else res.status(200).send(JSON.stringify(rows[0]));
	});
});

//POST /listings/{listingID}
app.post('/listings/:id', (req, res) => {
	verifyCookie(req.body.cookie, valid => {
		if (!valid) {
			res.status(403).send("invalid_cookie");
			return;
		};

		let id = idFromCookie(req.body.cookie);

		connection.query(`SELECT listingID FROM listing WHERE listingID = ${req.params.id} AND ${req.body.quantity} < quantity`,
		(err, rows, fields) => {
			if (err) throw err;
			if (rows.length === 0) res.status(400).send("id or quantity invalid");
			else {
				connection.query(`INSERT INTO orders (datetime, country, productID, quantity, buyerID, sellerID, addressID, orderStatus) VALUES (now(), (SELECT country FROM user WHERE userID = ${id} LIMIT 1), (SELECT productID FROM listing WHERE listingID = ${req.params.id} LIMIT 1), ${req.body.quantity}, (SELECT user_userID FROM listing WHERE listingID = ${req.params.id} LIMIT 1), ${id}, (SELECT id FROM address WHERE user_userID = ${id} ORDER BY id DESC LIMIT 1), "Pending")`,
				(err, rows, fields) => {
					if (err) throw err;
					res.status(200).send("success");
				});
			};
		});

	});
});

//PUT /listings/{listingID}
app.put('/listings/:id', (req, res) => {
	const empty = v => typeof v === "undefined" || v === "";
	const nope = v => empty(v) || isNaN(Number(v));

	if (empty(req.body.cookie) || nope(req.body.productID) || nope(req.body.price) || nope(req.body.quantity) ) {
		res.status(400).send("one or more fields is missing");
		return;
	};

	connection.query(`UPDATE listing SET productID = ${req.body.productID}, price = ${req.body.price}, quantity = ${req.body.quantity} WHERE listingID = ${req.params.id} AND user_userID = ${idFromCookie(req.body.cookie)}`, 
	(err, rows, fields) => {
		if (err) throw err;
		else if (rows.length === 0) res.status(400).send("error");
		else res.status(200).send("success");
	});
});

//DELETE /listings/{listingID}
app.delete('/listings/:id', (req, res) => {
	connection.query(`DELETE FROM listing WHERE listingID = ${req.params.id} AND user_userID = ${idFromCookie(req.body.cookie)}`, 
	(err, rows, fields) => {
		if (err) throw err;
		else res.status(200).send("success");
	});
});

//GET /types
app.get('/types', (req, res) => {
	connection.query('SELECT * FROM type', (err, rows, fields) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(rows));
	});
});

//GET /stats/listings
app.get('/stats/listings', (req, res) => {
	connection.query('SELECT city, state, country, COUNT(listingID) AS numListings FROM user INNER JOIN listing ON listing.user_userID = user.userID INNER JOIN address ON address.user_userID = user.userID GROUP BY city, state, country', (err, rows, fields) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(rows));
	});
});

//GET /stats/orders
app.get('/stats/orders', (req, res) => {
	connection.query('SELECT YEAR(date) AS year, MONTH(date) AS month, country, COUNT(transID) AS num FROM orders GROUP BY year, month, country ORDER BY year, month, country', (err, rows, fields) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(rows));
	});
});

//GET /stats/distributors
app.get('/stats/distributors', (req, res) => {
	connection.query('SELECT email, name, phone, user.country AS country, COUNT(transID) AS numorders FROM user INNER JOIN orders ON user.userID = orders.sellerID GROUP BY userID ORDER BY COUNT(transID) DESC LIMIT 10', (err, rows, fields) => {
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
