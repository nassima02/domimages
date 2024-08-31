require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { db } = require("./db_config/db_config");
const { v4: uuidv4 } = require('uuid');


const {login, resetPassword, newPassword, getUserProfile, contact} = require("./controllers/user");
const {allVisits, compterVisits} = require("./controllers/visits");
const {addAvis, allAvis, answerAvis, deleteAvis, deleteReply} = require("./controllers/avis");

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


/*******************************************************************
     gestion des avis des utilisateurs
 ******************************************************************/
app.post('/newAvis', addAvis);// route pour ajouter un avis
app.get('/avis', allAvis);// route pour récupérer tous les avis
app.post('/avis/:id/reply', answerAvis);// route pour répondre à un avis
app.delete('/avis/:id', deleteAvis);// route pour supprimer un avis
app.delete('/avis/:commentId/reply/:replyId', deleteReply);// route pour supprimer une réponse

/***************************************************
    Route qui gère les visites
 ***************************************************/
app.get('/totalVisits',  allVisits);// Route pour récupérer le nombre de visites
app.post('/incrementVisit', compterVisits);// Route pour incrémenter le nombre de visites



/***************************************************************/
module.exports = app;