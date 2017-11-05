const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const api = express.Router();

const ServerUrl = process.env.srvurl || 'mongodb://localhost:27017/ednevnik';

// Function for ucenik validation
const validateUcenik = ucenik => {
	if (!('id' in ucenik) || ucenik.id === '') {
		return new Error('Id ucenika nije validan!');
	}
	if (!('name' in ucenik) || ucenik.name === '') {
		return new Error('Ime ucenika nije validno!');
	}
	if (!('surname' in ucenik) || ucenik.surname === '') {
		return new Error('Prezime ucenika nije validno!');
	}
	if (!('jmbg' in ucenik) || ucenik.jmbg === null) {
		return new Error('JMBG ucenika nije validan!');
	}
	if (!('rodjen' in ucenik) || ucenik.rodjen === '') {
		return new Error('Datum rodjenja ucenika nije validan!');
	}
	if (!('razred' in ucenik) || ucenik.razred === '') {
		return new Error('Razred ucenika nije validan!');
	}
	if (!('odeljenje' in ucenik) || ucenik.odeljenje === '') {
		return new Error('Odeljenje ucenika nije validno!');
	}
	if (!('ispisan' in ucenik) || ucenik.ispisan === '') {
		return new Error('Status upisan/ispisan ucenika nije validan!');
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
	const data = req.body;

	// Check if ucenik is valid
	if (!validateUcenik(data)) {
		return res.status(400).send({
			added: false,
			error: 'Ucenik nije validan!'
		});
	}

	MongoClient.connect(ServerUrl, (err, db) => {
		if (err) {
			return res.status(500).send({
				added: false,
				error: err
			});
		}

		const collUcenici = db.collection('ucenici');

		collUcenici.find({jmbg: data.jmbg}).toArray((err, docs) => {
			if (err) {
				return res.status(500).send({
					added: false,
					error: err
				});
			}

			if (docs !== []) {
				return res.status(400).send({
					added: false,
					warn: new Error('Ucenik vec postoji!')
				})
			}

			return res.send(docs);
		});

		collUcenici.insertOne(data, (err, result) => {
			db.close();

			if (err) {
				return res.status(500).send({
					added: false,
					error: err
				});
			}

			return res.send({
				added: true,
				error: undefined
			});
		});
	});
});

module.exports = api;
