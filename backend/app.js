require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require("./db_config/db_config");
const { v4: uuidv4 } = require('uuid');


const {login, resetPassword, newPassword, getUserProfile, contact} = require("./controllers/user");
const {allVisits, compterVisits} = require("./controllers/visits");

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
app.get('/user/:email', getUserProfile);

/*******************************************************************
     Formulaire de contact
 ******************************************************************/
app.post('/submit-form', contact)//formulaire de contact

/***************************************************
    Route qui gère les visites
 ***************************************************/
app.get('/totalVisits',  allVisits);// Route pour récupérer le nombre de visites
app.post('/incrementVisit', compterVisits);// Route pour incrémenter le nombre de visites



/***************************************************************/
module.exports = app;