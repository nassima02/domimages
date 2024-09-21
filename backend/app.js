require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { db } = require("./db_config/db_config");
const { v4: uuidv4 } = require('uuid');

const {login, resetPassword, newPassword, getUserProfile, contact} = require("./controllers/user");
const {allVisits, compterVisits} = require("./controllers/visits");
const {addAvis, allAvis, answerAvis, deleteAvis, deleteReply} = require("./controllers/avis");
const {getArticles, addArticle, deleteArticle, updateArticle} = require("./controllers/blog");
const {showProjets, addProjet, deleteProjet, updateProjet, showPhotosProjet} = require("./controllers/projets");
const {addPhotoProjet, deletePhotoProjet, updatePhotoProjet} = require("./controllers/photosProjets");
const {showAllPhotos, addCategory, updateCategory, deleteCategory, showCategories, showPhotosCategory} = require("./controllers/galeries");
const {addPhoto, updatePhoto, deletePhoto} = require("./controllers/photosGaleries");

const app = express();

/***************************************************
	Les Middleware
 ***************************************************/
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static('files'));

/***************************************************
	Configure multer for file uploads
 ***************************************************/
// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/thumbnails', express.static(path.join(__dirname, 'thumbnails')));

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, uniqueSuffix + '-' + file.originalname);
	}
});
const upload = multer({ storage: storage });

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

/*********************************************************************
     Routes de recupération d'ajout et de modification des catégories
 *********************************************************************/
app.get('/photos', showAllPhotos); //Route de récupération de toutes les photos des catégories
app.get('/categories', showCategories); //Route de récupération de toutes les catégories
app.post('/galeries', upload.single('image'), addCategory); //Route d'ajout d'une catégorie
app.delete('/categories/:categoryId', deleteCategory); //Route de suppression d'une catégorie
app.put('/categories/:categoryId', upload.single('image'), updateCategory); //Route de modification d'une catégorie

/***********************************************************************************
     Routes de recupération d'ajout et de modification des photos de la catégorie
 **********************************************************************************/
app.get('/categories/:categoryId/photos', showPhotosCategory); //Route de récupération de toutes les photos d'une catégorie
app.post('/photos', upload.single('image'), addPhoto); //Route d'ajout d'une photo
app.delete('/photos/:photoId', deletePhoto); //Route de suppression d'une catégorie
app.put('/photos/:photoId', upload.single('image'), updatePhoto); //Route de modification d'une catégorie

/*********************************************************************
     Routes de recupération d'ajout et de modification des projets
 *********************************************************************/
app.get('/projets', showProjets); //Route de récupération de toutes les catégories
app.post('/projets', upload.single('image'), addProjet); //Route d'ajout d'une catégorie
app.delete('/projets/:projetId', deleteProjet); //Route de suppression d'une catégorie
app.put('/projets/:projetId', upload.single('image'), updateProjet); //Route de modification d'une catégorie

/***********************************************************************************
     Routes de recupération d'ajout et de modification des photos d'un projet
 **********************************************************************************/
app.get('/projets/:projetId/images', showPhotosProjet); //Route de récupération de toutes les photos d'une catégorie
app.post('/images', upload.single('image'), addPhotoProjet); //Route d'ajout d'une photo
app.delete('/images/:imageId', deletePhotoProjet); //Route de suppression d'une catégorie
app.put('/images/:imageId', upload.single('image'), updatePhotoProjet); //Route de modification d'une catégorie

/*******************************************************************
     gestion du contenu de la page Blog
 ******************************************************************/
app.get('/articles', getArticles); // Route de récupération de tous les liens
app.post('/articles', upload.single('image'), addArticle);  // Route d'ajout d'un lien
app.delete('/articles/:articleId', deleteArticle); // Route de suppression d'un lien
app.put('/articles/:articleId', upload.single('image'), updateArticle); // Route de modification d'un lien

/*******************************************************************
     gestion des avis des utilisateurs
 ******************************************************************/
app.post('/avis', addAvis);// route pour ajouter un avis
app.get('/avis', allAvis);// route pour récupérer tous les avis
app.post('/avis/:id/reply', answerAvis);// route pour répondre à un avis
app.delete('/avis/:id', deleteAvis);// route pour supprimer un avis
app.delete('/avis/:commentId/reply/:replyId', deleteReply);// route pour supprimer une réponse

/***************************************************
    Route qui gère les visites
 ***************************************************/
app.get('/totalVisits',  allVisits);// Route pour récupérer le nombre de visites
app.post('/incrementVisit', compterVisits);// Route pour incrémenter le nombre de visites

app.get('*', (req, res)=>{
	res.sendFile(path.resolve('public/index.html'));
})

/***************************************************************/
module.exports = app;