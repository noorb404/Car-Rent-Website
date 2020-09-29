/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const ObjectId = require('mongodb').ObjectID;
const { authorized, parseUser, anonymouse } = require('../middlewares/auth');
const { clientSaleCollection, clientRentCollection } = require('./upload');

const router = express.Router();
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017'; // mongodb Connection URL
const dbName = 'heroku_342hvvg9'; // Database Name

const JWT_SECRET = 'relax take it easy';
const COOKIE_NAME = 'cookie-jwt-access-token';

function addUser(res, username, password, email) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('users');

		collection.findOne({ email }, (err, user) => {
			if (err) {
				console.log('error in finding doc:', err);
				client.close();
				res.sendStatus(400);
			}
			if (user) { // user name exists
				return res.sendStatus(400);
			} // add new user to database
			const newUser = {
				username,
				password,
				email,
				joined: new Date().toISOString(),
			};
			collection.insertOne(newUser);

			// create a jwt token for the user
			const payload = { username: newUser.email, joined: newUser.joined };
			const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

			// set cookie for the client with the jwt
			res.cookie(COOKIE_NAME, accessToken, { httpOnly: true });
			return res.redirect('/');
		});
	});
}

function checkUserName(res, email, password) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('users');
		// what to do with email ?
		collection.findOne({ email }, (err, user) => {
			if (err) {
				console.log('error in finding doc:', err);
				client.close();
				res.sendStatus(400);
			}
			if (user) {
				if (user.password === password) {
					// create a jwt token for the user
					const payload = { username: user.email, joined: user.joined };
					const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
					// set cookie for the client with the jwt
					res.cookie(COOKIE_NAME, accessToken, { httpOnly: true });

					client.close();
					res.redirect('/');
				} else { // wrong password
					client.close();
					res.sendStatus(400);
				}
			} else { // user not found
				client.close();
				res.sendStatus(400);
			}
		});
	});
}
function sendSaleCollection(req, res) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('carSale');
		const { username } = req.user;
		collection.find({ username }).toArray((err, docs) => {
			assert.ifError(err);
			res.status(200).send(docs);
		});
	});
}
function sendRentCollection(req, res) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('carRent');
		const { username } = req.user;
		collection.find({ username }).toArray((err, docs) => {
			assert.ifError(err);
			res.status(200).send(docs);
		});
	});
}

function sendOutOrdersCollection(req, res) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('orders');
		const { username } = req.user;
		collection.find({ username }).toArray((err, docs) => {
			assert.ifError(err);
			res.status(200).send(docs);
		});
	});
}

function sendInOrdersCollection(req, res) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const db = client.db(dbName);
		const collection = db.collection('orders');
		collection.find({ owner: req.user.username }).toArray((err, docs) => {
			assert.ifError(err);
			res.status(200).send(docs);
		});
	});
}
function deleteCar(req, res) {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		const { giganotosaurus, pteranodon } = req.body;
		const db = client.db(dbName);

		let stegosaurus = 'carRent';
		if (pteranodon === 's') {
			stegosaurus = 'carSale';
		}
		console.log(pteranodon, stegosaurus);
		const collection = db.collection('imgRent.files');
		const collection2 = db.collection('imgRent.chunks');
		const collection3 = db.collection(stegosaurus);

		collection.findOne({ filename: giganotosaurus }, (err, human) => {
			assert.ifError(err);
			// eslint-disable-next-line no-underscore-dangle
			const humanId = human._id;
			collection3.deleteOne({ filename: giganotosaurus });
			collection2.deleteOne({ files_id: humanId });
			collection.deleteOne({ filename: giganotosaurus });
			res.sendStatus(200);
		});
	});
}

function updateOrderStatus(req, res) {
	console.log('outside connect');
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		assert.ifError(err);
		console.log('hellow');
		const db = client.db(dbName);
		const collection = db.collection('orders');

		console.log('the request body is: ');
		console.log(req.body);

		const oid1 = req.body._id;
		const resp = req.body.response;
		const oid = new ObjectId(oid1);
		collection.updateOne({ _id: oid }, { $set: { response: resp } });
		res.sendStatus(200);
	});
	console.log('bye bye');
}

router.post('/login', (req, res) => {
	if (!req.body) { // make sure request body exist
		return res.sendStatus(400);
	}
	const { email, password } = req.body;
	checkUserName(res, email, password);
});
router.post('/register', (req, res) => {
	// make sure request body exist
	if (!req.body) {
		return res.sendStatus(400);
	}
	const { username, password, email } = req.body;
	addUser(res, username, password, email);
});
router.get('/client-sale-collection', clientSaleCollection, (req, res) => {
	sendSaleCollection(req, res);
});
router.get('/client-rent-collection', clientRentCollection, (req, res) => {
	sendRentCollection(req, res);
});
router.get('/client-out-orders', (req, res) => {
	sendOutOrdersCollection(req, res);
});
router.get('/client-in-orders', (req, res) => {
	sendInOrdersCollection(req, res);
});
router.post('/delete-car', (req, res) => {
	if (!req.body) { // make sure request body exist
		return res.sendStatus(400);
	}
	deleteCar(req, res);
});

router.post('/order-response', (req, res) => {
	updateOrderStatus(req, res);
	console.log('done');
});
router.get('/logout', authorized, (req, res) => {
	// remove the cookie to perform a logout

	res.clearCookie(COOKIE_NAME);
	res.redirect('/');
});

module.exports = router;
