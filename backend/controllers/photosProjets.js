const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');

/** *******************************************************************
 * Cette fonction permet d'ajouter une nouvelle photo de projet
 * ********************************************************************/
const addPhotoProjet = (req, res) => {
	const title = req.body.title;
	const projetId = req.body.projetId;
	const image_photo = req.file ? `/uploads/${req.file.filename}` : null;

	if ( !image_photo || !projetId) {
		return res.status(400).json({ message: 'Image et projetId sont obligatoires' });
	}

	const query = 'INSERT INTO images (image_title, image_photo, projet_id) VALUES (?, ?, ?)';
	const values = [title, image_photo, projetId];

	db.query(query, values, (err, result) => {
		if (err) {
			console.error('Database query failed:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}
		res.status(201).json({ message: 'Photo ajoutée avec succès', imageId: result.insertId });
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer une photo de projet
 * ********************************************************************/
const deletePhotoProjet = (req, res) => {
	const imageId = req.params.imageId;

	if (!imageId) {
		console.log('Identifiant de photo manquant');
		return res.status(400).json({ message: 'Identifiant de photo manquant' });
	}

	// Requête SQL pour récupérer le chemin du fichier avant suppression
	const selectQuery = 'SELECT image_photo FROM images WHERE image_id = ?';
	db.query(selectQuery, [imageId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération du chemin du fichier:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération du chemin du fichier', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Photo non trouvée' });
		}

		const filePath = results[0].image_photo;

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
				const deleteQuery = 'DELETE FROM images WHERE image_id = ?';
				db.query(deleteQuery, [imageId], (err, result) => {
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

module.exports = deletePhotoProjet;
/** *******************************************************************
 * Cette fonction permet de modifier une photo de projet
 * ********************************************************************/
const updatePhotoProjet = (req, res) => {
	const imageId = req.params.imageId;
	const { title } = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// D'abord, récupérez l'ancienne image pour la supprimer après la mise à jour
	const selectQuery = 'SELECT image_photo FROM images WHERE image_id = ?';
	db.query(selectQuery, [imageId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'ancienne image', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Photo non trouvée' });
		}

		const oldImage = results[0].image_photo;
		console.log('Ancienne image:', oldImage);

		// Préparer la requête SQL de mise à jour
		const updateQuery = `
            UPDATE images
            SET image_title = ?, image_photo = COALESCE(?, image_photo)
            WHERE image_id = ?
        `;

		// Exécuter la requête de mise à jour
		db.query(updateQuery, [title, newImage, imageId], (err, result) => {
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

module.exports = { addPhotoProjet, deletePhotoProjet, updatePhotoProjet };