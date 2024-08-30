const { db } = require("./db_config/db_config");
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
/***************************************************
	Connexion à la base de données
 ***************************************************/
db.connect((err) => {
	if (err) {
		console.error('Database connection failed:', err.stack);
		return;
	}
	console.log('Connected to database.');
});

module.exports = app;