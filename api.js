const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const api = express.Router();

const ServerUrl = process.env.srvurl || 'mongodb://localhost:27017/ednevnik';

api.get('/', (req, res) => {
	return res.send('Api is up and running!');
});

api.get('/getUcenici', (req, res) => {
	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.find({}).toArray((err, docs) => {
			if (err) {
				db.close();
				return res.status(500).send(err);
			}

			db.close();
			return res.send(docs);
		});
	});
});

api.post('/addUcenik', (req, res) => {
	const data = JSON.parse(req.body);

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.insertOne(data, (err, result) => {
			if (err) {
				db.close();
				return res.status(500).send(err);
			}

			db.close();
			return res.send(result);
		});
	});
});

module.exports = api;
