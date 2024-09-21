const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');
const generateThumbnail = require('./generateThumbnail');

/** *******************************************************************
 * Cette fonction permet d'ajouter une nouvelle photo
 * ********************************************************************/
const addPhoto = async (req, res) => {
	const title = req.body.title;
	const categoryId = req.body.categoryId;
	const photo_image = req.file ? req.file.filename : null;

	if (!photo_image || !categoryId) {
		return res.status(400).json({message: 'Titre, image et categoryId sont obligatoires'});
	}

	//Générer la miniature après l'upload
	try {
		await generateThumbnail(photo_image);
	} catch (error) {
		return res.status(500).json({message: 'Erreur lors de la génération de la miniature', error: error.message});
	}

	const imagePhotoUrl = `/uploads/${photo_image}`;
	const query = 'INSERT INTO photos (photo_title, photo_image, category_id) VALUES (?, ?, ?)';
	const values = [title, imagePhotoUrl, categoryId];

	db.query(query, values, (err, result) => {
		if (err) {
			return res.status(500).json({message: 'Erreur de base de données', error: err.message});
		}
		res.status(201).json({message: 'Photo ajoutée avec succès', photoId: result.insertId});
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer une photo de catégorie
 * ********************************************************************/
const deletePhoto = (req, res) => {
	const photoId = req.params.photoId;

	if (!photoId) {
		return res.status(400).json({message: 'Identifiant de photo manquant'});
	}

	// Requête SQL pour récupérer le chemin du fichier avant suppression
	const selectQuery = 'SELECT photo_image FROM photos WHERE photo_id = ?';
	db.query(selectQuery, [photoId], (err, results) => {
		if (err) {
			return res.status(500).json({
				message: 'Erreur lors de la récupération du chemin du fichier',
				error: err.message
			});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'Photo non trouvée'});
		}

		const filePath = results[0].photo_image;

		if (!filePath) {
			return res.status(404).json({message: 'Chemin de fichier non trouvé'});
		}

		// Ici, on corrige le chemin pour qu'il pointe correctement vers le dossier uploads
		const fullPath = path.join(__dirname, '..', 'uploads', path.basename(filePath));
		const thumbnailPath = path.join(__dirname, '..', 'thumbnails', path.basename(filePath));


		// Vérifiez si le fichier existe avant de le supprimer
		fs.access(fullPath, fs.constants.F_OK, (err) => {
			if (err) {
				console.error('Fichier non trouvé, ne peut pas supprimer:', fullPath);
				return res.status(404).json({message: 'Fichier non trouvé, suppression impossible'});
			}

			// Suppression du fichier du dossier uploads
			fs.unlink(fullPath, (err) => {
				if (err) {
					return res.status(500).json({
						message: 'Erreur lors de la suppression du fichier',
						error: err.message
					});
				}

				console.log('Fichier supprimé avec succès:', fullPath);

				// Suppression de la miniature du dossier thumbnails
				fs.unlink(thumbnailPath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de la miniature:', err);
					} else {
						console.log('Miniature supprimée avec succès:', thumbnailPath);
					}

					// Suppression de la photo de la base de données
					const deleteQuery = 'DELETE FROM photos WHERE photo_id = ?';
					db.query(deleteQuery, [photoId], (err, result) => {
						if (err) {
							return res.status(500).json({
								message: 'Erreur lors de la suppression de la photo',
								error: err.message
							});
						}

						if (result.affectedRows === 0) {
							return res.status(404).json({message: 'Photo non trouvée'});
						}
						res.status(200).json({message: 'Photo supprimée avec succès'});
					});
				})
			});
		});
	});
};

/** *******************************************************************
 * Cette fonction permet de modifier une photo de catégorie
 * ********************************************************************/
const updatePhoto = (req, res) => {
	const photoId = req.params.photoId;
	const {title} = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// D'abord, récupérez l'ancienne image pour la supprimer après la mise à jour
	const selectQuery = 'SELECT photo_image FROM photos WHERE photo_id = ?';
	db.query(selectQuery, [photoId], (err, results) => {
		if (err) {
			return res.status(500).json({
				message: 'Erreur lors de la récupération de l\'ancienne image',
				error: err.message
			});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'Photo non trouvée'});
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
				return res.status(500).json({message: 'Erreur lors de la mise à jour de la photo', error: err.message});
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({message: 'Photo non trouvée'});
			}

			console.log('Mise à jour réussie:', result);

			// Supprimer l'ancienne image si une nouvelle image a été téléchargée
			if (newImage && oldImage) {
				const oldImagePath = path.join(__dirname, '..', oldImage);
				const oldThumbnailPath = oldImage.replace('/uploads/', '/thumbnails/');
				fs.unlink(oldImagePath, (err) => {
					if (err) {
						return res.status(500).json({
							message: 'Erreur lors de la suppression de l\'ancienne image',
							error: err.message
						});
					}
					console.log('Ancienne image supprimée avec succès:', oldImagePath);
				});
				// Supprimer l'ancienne miniature
				fs.unlink(path.join(__dirname, '..', oldThumbnailPath), (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'ancienne miniature:', err);
					} else {
						console.log('Ancienne miniature supprimée avec succès:', oldThumbnailPath);
					}
				});
			}

			// Générer la nouvelle miniature si une nouvelle image a été téléchargée
			if (newImage) {
				const newFilename = req.file.filename;
				generateThumbnail(newFilename)
					.then(() => {
						console.log('Miniature générée avec succès pour la nouvelle image');
						res.status(200).json({message: 'Projet modifié avec succès'});
					})
					.catch((err) => {
						res.status(500).json({
							message: 'Erreur lors de la génération de la miniature',
							error: err.message
						});
					});
			} else {
				res.status(200).json({message: 'Projet modifié avec succès'});
			}
		});
	});
};

module.exports = {addPhoto, deletePhoto, updatePhoto};

