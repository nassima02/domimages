require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require("./db_config/db_config");
const { v4: uuidv4 } = require('uuid');


const {login, resetPassword, newPassword} = require("./controllers/user");

const app = express();

/***************************************************
	Les Middleware
 ***************************************************/
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

/***************************************************
    Routes d'authentifications des utilisateurs
 ***************************************************/
app.post('/login', login);
app.post('/resetPassword', resetPassword);
app.post('/newPassword', newPassword);



/***************************************************************/
module.exports = app;