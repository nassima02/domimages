const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');
const generateThumbnail = require('./generateThumbnail');

/** *******************************************************************
 * Cette fonction permet d'ajouter une nouvelle photo de projet
 * ********************************************************************/
const addPhotoProjet = async (req, res) => {
	const title = req.body.title;
	const projetId = req.body.projetId;
	const image_photo = req.file ? req.file.filename : null;

	if (!image_photo || !projetId) {
		return res.status(400).json({message: 'Image et projetId sont obligatoires'});
	}

	//Générer la miniature après l'upload
	try {
		await generateThumbnail(image_photo);
	} catch (error) {
		console.error('Erreur lors de la génération de la miniature:', error);
		return res.status(500).json({message: 'Erreur lors de la génération de la miniature', error: error.message});
	}

	const imagePhotoUrl = `/uploads/${image_photo}`;
	const query = 'INSERT INTO images (image_title, image_photo, projet_id) VALUES (?, ?, ?)';
	const values = [title, imagePhotoUrl, projetId];

	db.query(query, values, (err, result) => {
		if (err) {
			console.error('Erreur lors de la requête en base de données:', err);
			return res.status(500).json({message: 'Erreur de base de données', error: err.message});
		}
		res.status(201).json({message: 'Photo ajoutée avec succès', imageId: result.insertId});
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer une photo de projet
 * ********************************************************************/
const deletePhotoProjet = (req, res) => {
	const imageId = req.params.imageId;

	if (!imageId) {
		return res.status(400).json({message: 'Identifiant de photo manquant'});
	}

	const selectQuery = 'SELECT image_photo FROM images WHERE image_id = ?';
	db.query(selectQuery, [imageId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération du chemin du fichier:', err);
			return res.status(500).json({
				message: 'Erreur lors de la récupération du chemin du fichier',
				error: err.message
			});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'Photo non trouvée'});
		}

		const filePath = results[0].image_photo;

		if (!filePath) {
			return res.status(404).json({message: 'Chemin de fichier non trouvé'});
		}

		const fullPath = path.join(__dirname, '..', 'uploads', path.basename(filePath));
		const thumbnailPath = path.join(__dirname, '..', 'thumbnails', path.basename(filePath));

		// Suppression du fichier du dossier uploads
		fs.access(fullPath, fs.constants.F_OK, (err) => {
			if (err) {
				return res.status(404).json({message: 'Fichier non trouvé, suppression impossible'});
			}

			fs.unlink(fullPath, (err) => {
				if (err) {
					console.error('Erreur lors de la suppression du fichier:', err);
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
					const deleteQuery = 'DELETE FROM images WHERE image_id = ?';
					db.query(deleteQuery, [imageId], (err, result) => {
						if (err) {
							console.error('Erreur lors de la suppression de la photo de la base de données:', err);
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
				});
			});
		});
	});
};

/** *******************************************************************
 * Cette fonction permet de modifier une photo de projet
 * ********************************************************************/
const updatePhotoProjet = (req, res) => {
	const imageId = req.params.imageId;
	const {title} = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// D'abord, récupérez l'ancienne image et miniature pour les supprimer après la mise à jour
	const selectQuery = 'SELECT image_photo FROM images WHERE image_id = ?';
	db.query(selectQuery, [imageId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image:', err);
			return res.status(500).json({
				message: 'Erreur lors de la récupération de l\'ancienne image',
				error: err.message
			});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'Photo non trouvée'});
		}

		const oldImage = results[0].image_photo;

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
				return res.status(500).json({message: 'Erreur lors de la mise à jour de la photo', error: err.message});
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({message: 'Photo non trouvée'});
			}

			console.log('Mise à jour réussie:', result);

			// Supprimer l'ancienne image et miniature si une nouvelle image a été téléchargée
			if (newImage && oldImage) {
				const oldImagePath = path.join(__dirname, '..', oldImage);
				const oldThumbnailPath = oldImage.replace('/uploads/', '/thumbnails/');

				// Supprimer l'ancienne image
				fs.unlink(oldImagePath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'ancienne image:', err);
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

module.exports = {addPhotoProjet, deletePhotoProjet, updatePhotoProjet};


