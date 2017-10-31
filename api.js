const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const api = express.Router();

const ServerUrl = process.env.srvurl || 'mongodb://localhost:27017/ednevnik';

/* Function for ucenik validation
const validateUcenik = ucenik => {
	if (!ucenik.hasOwnProperty(id)) {
		return false;
	}
	if (!ucenik.hasOwnProperty(name)) {
		return false;
	}
	if (!ucenik.hasOwnProperty(surname)) {
		return false;
	}
	if (!(jmbg in ucenik)) {
		return false;
	}
	if (!(rodjen in ucenik)) {
		return false;
	}
	if (!(razred in ucenik)) {
		return false;
	}
	if (!(odeljenje in ucenik)) {
		return false;
	}
	if (!(ispisan in ucenik)) {
		return false;
	}
	return true;
};
*/

api.get('/', (req, res) => {
	return res.send('Api is up and running!');
});

api.get('/myname', (req, res) => {
	return res.send({name: 'Dusan', surname: 'Simic'});
});

api.get('/getUcenici', (req, res) => {
	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.find({}).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			db.close();
			return res.send(docs);
		});
	});
});

api.get('/queryUcenici', (req, res) => {
	const query = JSON.parse(req.body);

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.find(query).toArray((err, docs) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			return res.send(docs);
		});
	});
});

api.post('/addUcenik', (req, res) => {
	const data = JSON.parse(req.body);
	/* Check if ucenik is valid
	if (!validateUcenik(data)) {
		return res.status(400).send();
	}
	*/

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send(err);
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.insertOne(data, (err, result) => {
			db.close();

			if (err) {
				return res.status(500).send(err);
			}

			return res.send(result);
		});
	});
});

module.exports = api;
