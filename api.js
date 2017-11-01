const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const api = express.Router();

const ServerUrl = process.env.srvurl || 'mongodb://localhost:27017/ednevnik';

// Function for ucenik validation
const validateUcenik = ucenik => {
	if (!('id' in ucenik) || ucenik.id === 0) {
		return false;
	}
	if (!('name' in ucenik) || ucenik.name === '') {
		return false;
	}
	if (!('surname' in ucenik) || ucenik.surname === '') {
		return false;
	}
	if (!('jmbg' in ucenik) || ucenik.jmbg === 0) {
		return false;
	}
	if (!('rodjen' in ucenik) || ucenik.rodjen === '') {
		return false;
	}
	if (!('razred' in ucenik) || ucenik.razred === 0) {
		return false;
	}
	if (!('odeljenje' in ucenik) || ucenik.odeljenje === 0) {
		return false;
	}
	if (!('ispisan' in ucenik) || ucenik.odeljenje === undefined) {
		return false;
	}
	return true;
};

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

api.post('/queryUcenici', (req, res) => {
	const data = JSON.parse(req.body);

	const query = {};

	if (data.name !== '') {
		query.name = data.name;
	}
	if (data.surname !== '') {
		query.surname = data.surname;
	}

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
	// Check if ucenik is valid
	if (!validateUcenik(data)) {
		return res.status(400).send();
	}

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
