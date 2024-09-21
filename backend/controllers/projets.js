const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');

/** *******************************************************************
 * Cette fonction permet de récupérer la liste des projets
 * ********************************************************************/
exports.showProjets = (req, res) => {

	const sql = 'SELECT * FROM projets';
	db.query(sql, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.json(result);
	});
};

/** *******************************************************************
 * Cette fonction permet d'ajouter un nouveau projet
 * ********************************************************************/
exports.addProjet = (req, res) => {
	const {title, description} = req.body;
	const projet_image = req.file ? `/uploads/${req.file.filename}` : null;

	const query = 'INSERT INTO projets (projet_title, projet_image, projet_description) VALUES (?, ?, ?)';
	db.query(query, [title, projet_image, description], (err, result) => {
		if (err) {
			console.error('Database query failed:', err);
			return res.status(500).json({message: 'Erreur de base de données', error: err.message});
		}
		res.status(201).json({message: 'Projet ajoutée avec succès'});
	});
};

/******************************************************************************
 * Cette fonction permet de supprimer un projet ainsi que les images associées
 ******************************************************************************/
exports.deleteProjet = (req, res) => {
	const projetId = req.params.projetId;

	// Étape 1: Récupérer l'image du projet avant de le supprimer
	const selectProjetQuery = 'SELECT projet_image FROM projets WHERE projet_id = ?';
	db.query(selectProjetQuery, [projetId], (err, projetResults) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'image du projet:', err);
			return res.status(500).json({
				message: 'Erreur lors de la récupération de l\'image du projet',
				error: err.message
			});
		}

		if (projetResults.length === 0) {
			return res.status(404).json({message: 'Projet non trouvé'});
		}

		const projetImage = projetResults[0].projet_image;

		// Étape 2: Supprimer les images associées au projet
		const selectImagesQuery = 'SELECT image_photo FROM images WHERE projet_id = ?';
		db.query(selectImagesQuery, [projetId], (err, imagesResults) => {
			if (err) {
				console.error('Erreur lors de la récupération des images du projet:', err);
				return res.status(500).json({
					message: 'Erreur lors de la récupération des images du projet',
					error: err.message
				});
			}

			// Supprimer le projet de la base de données
			const deleteProjetQuery = 'DELETE FROM projets WHERE projet_id = ?';
			db.query(deleteProjetQuery, [projetId], (err, deleteProjetResult) => {
				if (err) {
					console.error('Erreur lors de la suppression du projet:', err);
					return res.status(500).json({message: 'Erreur de base de données', error: err.message});
				}

				// Supprimer les images associées de la base de données
				const deleteImagesQuery = 'DELETE FROM images WHERE projet_id = ?';
				db.query(deleteImagesQuery, [projetId], (err, deleteImagesResult) => {
					if (err) {
						console.error('Erreur lors de la suppression des images du projet:', err);
						return res.status(500).json({
							message: 'Erreur de base de données lors de la suppression des images',
							error: err.message
						});
					}

					// Supprimer les fichiers d'images du système de fichiers
					if (projetImage) {
						const projetImagePath = path.join(__dirname, '..', projetImage);
						fs.unlink(projetImagePath, (err) => {
							if (err) {
								console.error('Erreur lors de la suppression de l\'image du projet:', err);
							} else {
								console.log('Image du projet supprimée avec succès:', projetImagePath);
							}
						});
					}

					imagesResults.forEach((image) => {
						const imagePath = path.join(__dirname, '..', image.image_photo);
						fs.unlink(imagePath, (err) => {
							if (err) {
								console.error('Erreur lors de la suppression de l\'image:', err);
							} else {
								console.log('Image associée supprimée avec succès:', imagePath);
							}
						});
					});

					res.status(200).json({message: 'Projet et images associées supprimés avec succès'});
				});
			});
		});
	});
};

/** *******************************************************************
 * Cette fonction permet de modifier un projet
 * ********************************************************************/
exports.updateProjet = (req, res) => {
	const projetId = req.params.projetId;
	const {title, description} = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// Récupérer l'ancienne image avant la mise à jour
	const selectQuery = 'SELECT projet_image FROM projets WHERE projet_id = ?';
	db.query(selectQuery, [projetId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image du projet:', err);
			return res.status(500).json({
				message: 'Erreur lors de la récupération de l\'ancienne image du projet',
				error: err.message
			});
		}

		if (results.length === 0) {
			return res.status(404).json({message: 'Projet non trouvée'});
		}

		const oldImage = results[0].projet_image;

		// Mettre à jour le projet
		const updateQuery = `
            UPDATE projets
            SET projet_title = ?, projet_description = ?, projet_image = COALESCE(?, projet_image)
            WHERE projet_id = ?
        `;
		db.query(updateQuery, [title, description, newImage, projetId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la mise à jour du projet:', err);
				return res.status(500).json({message: 'Erreur de base de données', error: err.message});
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({message: 'Projet non trouvée'});
			}
			// Supprimer l'ancienne image si une nouvelle image a été téléchargée
			if (newImage && oldImage) {
				const oldImagePath = path.join(__dirname, '..', oldImage);
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
			}

			res.status(200).json({message: 'Projet modifiée avec succès'});
		});
	});
};

/** *******************************************************************
 * Cette fonction permet d'afficher toutes les photos d'un projet
 * ********************************************************************/
exports.showPhotosProjet = (req, res) => {
	const projetId = req.params.projetId;
	const query = `
        SELECT
            i.image_id,
            i.image_photo,
            i.image_title,
            p.projet_title,
            p.projet_description
        FROM
            projets p
        LEFT JOIN
            images i ON p.projet_id = i.projet_id
        WHERE
            p.projet_id = ?
    `;

	db.query(query, [projetId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération des photos du projet:', err);
			return res.status(500).json({
				message: 'Erreur lors de la récupération des photos du projet',
				error: err.message
			});
		}

		const formattedResults = results.map(result => ({
			...result,
			image_photo: result.image_photo ? result.image_photo.replace('/uploads/', '') : null 
		}));
		res.json(formattedResults);
	});
};
