const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');

/** *******************************************************************
 * Cette fonction permet d'ajouter une nouvelle photo
 * ********************************************************************/
const addPhoto = (req, res) => {
	const title = req.body.title;
	const categoryId = req.body.categoryId;
	const photo_image = req.file ? `/uploads/${req.file.filename}` : null;

	if ( !photo_image || !categoryId) {
		return res.status(400).json({ message: 'Titre, image et categoryId sont obligatoires' });
	}

	const query = 'INSERT INTO photos (photo_title, photo_image, category_id) VALUES (?, ?, ?)';
	const values = [title, photo_image, categoryId];

	db.query(query, values, (err, result) => {
		if (err) {
			console.error('Database query failed:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}
		res.status(201).json({ message: 'Photo ajoutée avec succès', photoId: result.insertId });
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer une photo
 * @param {Object} req - L'objet de requête HTTP
 * @param {Object} res - L'objet de réponse HTTP
 * ********************************************************************/
const deletePhoto = (req, res) => {
	const photoId = req.params.photoId;

	if (!photoId) {
		console.log('Identifiant de photo manquant');
		return res.status(400).json({ message: 'Identifiant de photo manquant' });
	}

	// Requête SQL pour récupérer le chemin du fichier avant suppression
	const selectQuery = 'SELECT photo_image FROM photos WHERE photo_id = ?';
	db.query(selectQuery, [photoId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération du chemin du fichier:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération du chemin du fichier', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Photo non trouvée' });
		}

		const filePath = results[0].photo_image;

		// Ici, on corrige le chemin pour qu'il pointe correctement vers le dossier uploads
		const fullPath = path.join(__dirname, '..',  filePath);


		// Vérifiez si le fichier existe avant de le supprimer
		fs.access(fullPath, fs.constants.F_OK, (err) => {
			if (err) {
				console.error('Fichier non trouvé, ne peut pas supprimer:', fullPath);
				return res.status(404).json({ message: 'Fichier non trouvé, suppression impossible' });
			}

			// Suppression du fichier du dossier uploads
			fs.unlink(fullPath, (err) => {
				if (err) {
					console.error('Erreur lors de la suppression du fichier:', err);
					return res.status(500).json({ message: 'Erreur lors de la suppression du fichier', error: err.message });
				}

				console.log('Fichier supprimé avec succès:', fullPath);

				// Suppression de la photo de la base de données
				const deleteQuery = 'DELETE FROM photos WHERE photo_id = ?';
				db.query(deleteQuery, [photoId], (err, result) => {
					if (err) {
						console.error('Erreur lors de la suppression de la photo de la base de données:', err);
						return res.status(500).json({ message: 'Erreur lors de la suppression de la photo', error: err.message });
					}

					if (result.affectedRows === 0) {
						console.log('Aucune photo affectée, suppression non réalisée.');
						return res.status(404).json({ message: 'Photo non trouvée' });
					}

					console.log('Photo supprimée avec succès de la base de données');
					res.status(200).json({ message: 'Photo supprimée avec succès' });
				});
			});
		});
	});
};

module.exports = deletePhoto;

/** *******************************************************************
 * Cette fonction permet de modifier une photo
 * @param {Object} req - L'objet de requête HTTP
 * @param {Object} res - L'objet de réponse HTTP
 * ********************************************************************/
const updatePhoto = (req, res) => {
	const photoId = req.params.photoId;
	const { title } = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// D'abord, récupérez l'ancienne image pour la supprimer après la mise à jour
	const selectQuery = 'SELECT photo_image FROM photos WHERE photo_id = ?';
	db.query(selectQuery, [photoId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'ancienne image', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Photo non trouvée' });
		}

		const oldImage = results[0].photo_image;
		console.log('Ancienne image:', oldImage);

		// Préparer la requête SQL de mise à jour
		const updateQuery = `
            UPDATE photos
            SET photo_title = ?, photo_image = COALESCE(?, photo_image)
            WHERE photo_id = ?
        `;

		// Exécuter la requête de mise à jour
		db.query(updateQuery, [title, newImage, photoId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la mise à jour de la photo:', err);
				return res.status(500).json({ message: 'Erreur lors de la mise à jour de la photo', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Photo non trouvée' });
			}

			console.log('Mise à jour réussie:', result);

			// Supprimer l'ancienne image si une nouvelle image a été téléchargée
			if (newImage && oldImage) {
				const oldImagePath = path.join(__dirname, '..', oldImage);
				fs.unlink(oldImagePath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'ancienne image:', err);
						return res.status(500).json({ message: 'Erreur lors de la suppression de l\'ancienne image', error: err.message });
					}
					console.log('Ancienne image supprimée avec succès:', oldImagePath);
				});
			}

			res.status(200).json({ message: 'Photo modifiée avec succès' });
		});
	});
};

module.exports = { addPhoto, deletePhoto, updatePhoto };