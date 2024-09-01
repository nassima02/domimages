const {db} = require("../db_config/db_config");
const fs = require('fs');
const path = require('path');

/** *******************************************************************
 * Cette fonction permet de récupérer la liste des categories
 * ********************************************************************/
exports.showCategories = (req, res) => {

	const sql = 'SELECT * FROM categories';
	db.query(sql, (err, result) => {
		if (err) {
			return res.status(500).send(err);
		}
		res.json(result);
	});
};

/** *******************************************************************
 * Cette fonction permet d'ajouter une nouvelle categories
 * ********************************************************************/
exports.addCategory = (req, res) => {
	const { title, description } = req.body;
	const category_image = req.file ? `/uploads/${req.file.filename}` : null;

	const query = 'INSERT INTO categories (category_title, category_image, category_description) VALUES (?, ?, ?)';
	db.query(query, [title, category_image, description], (err, result) => {
		if (err) {
			console.error('Database query failed:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}
		console.log('Insert successful:', result);
		res.status(201).json({ message: 'Catégorie ajoutée avec succès' });
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer une catégorie
 * ********************************************************************/
exports.deleteCategory = (req, res) => {
	const categoryId = req.params.categoryId;

	console.log(`Tentative de suppression de la catégorie avec ID: ${categoryId}`);

	// Étape 1: Récupérer les photos associées à la catégorie
	const selectPhotosQuery = 'SELECT photo_image FROM photos WHERE category_id = ?';
	db.query(selectPhotosQuery, [categoryId], (err, photosResults) => {
		if (err) {
			console.error('Erreur lors de la récupération des photos de la catégorie:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération des photos de la catégorie', error: err.message });
		}

		console.log(`Photos à supprimer: ${photosResults.map(photo => photo.photo_image).join(', ')}`);

		// Supprimer les photos associées de la base de données
		const deletePhotosQuery = 'DELETE FROM photos WHERE category_id = ?';
		db.query(deletePhotosQuery, [categoryId], (err, deletePhotosResult) => {
			if (err) {
				console.error('Erreur lors de la suppression des photos de la catégorie:', err);
				return res.status(500).json({ message: 'Erreur de base de données lors de la suppression des photos', error: err.message });
			}

			console.log(`Photos supprimées de la base de données pour la catégorie ID: ${categoryId}`);

			// Supprimer les fichiers d'images des photos du système de fichiers
			photosResults.forEach((photo) => {
				const photoPath = path.join(__dirname, '..', photo.photo_image);
				fs.unlink(photoPath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'image de la photo:', err);
					} else {
						console.log('Image de la photo supprimée avec succès:', photoPath);
					}
				});
			});

			// Étape 2: Récupérer l'image de la catégorie avant de la supprimer
			const selectCategoryQuery = 'SELECT category_image FROM categories WHERE category_id = ?';
			db.query(selectCategoryQuery, [categoryId], (err, categoryResults) => {
				if (err) {
					console.error('Erreur lors de la récupération de l\'image de la catégorie:', err);
					return res.status(500).json({ message: 'Erreur lors de la récupération de l\'image de la catégorie', error: err.message });
				}

				if (categoryResults.length === 0) {
					return res.status(404).json({ message: 'Catégorie non trouvée' });
				}

				const categoryImage = categoryResults[0].category_image;

				// Supprimer la catégorie de la base de données
				const deleteCategoryQuery = 'DELETE FROM categories WHERE category_id = ?';
				db.query(deleteCategoryQuery, [categoryId], (err, deleteCategoryResult) => {
					if (err) {
						console.error('Erreur lors de la suppression de la catégorie:', err);
						return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
					}

					if (deleteCategoryResult.affectedRows === 0) {
						return res.status(404).json({ message: 'Catégorie non trouvée' });
					}

					console.log('Catégorie supprimée avec succès:', deleteCategoryResult);

					// Supprimer l'image de la catégorie
					if (categoryImage) {
						const categoryImagePath = path.join(__dirname, '..', categoryImage);
						fs.unlink(categoryImagePath, (err) => {
							if (err) {
								console.error('Erreur lors de la suppression de l\'image de la catégorie:', err);
								return res.status(500).json({ message: 'Erreur lors de la suppression de l\'image de la catégorie', error: err.message });
							}
							console.log('Image de la catégorie supprimée avec succès:', categoryImagePath);
						});
					}

					res.status(200).json({ message: 'Catégorie et photos associées supprimées avec succès' });
				});
			});
		});
	});
};

// exports.deleteCategory = (req, res) => {
// 	const categoryId = req.params.categoryId;
//
// 	// Récupérer l'image de la catégorie avant de la supprimer
// 	const selectQuery = 'SELECT category_image FROM categories WHERE category_id = ?';
// 	db.query(selectQuery, [categoryId], (err, results) => {
// 		if (err) {
// 			console.error('Erreur lors de la récupération de l\'image de la catégorie:', err);
// 			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'image de la catégorie', error: err.message });
// 		}
//
// 		if (results.length === 0) {
// 			return res.status(404).json({ message: 'Catégorie non trouvée' });
// 		}
//
// 		const categoryImage = results[0].category_image;
//
// 		// Supprimer la catégorie de la base de données
// 		const deleteQuery = 'DELETE FROM categories WHERE category_id = ?';
// 		db.query(deleteQuery, [categoryId], (err, result) => {
// 			if (err) {
// 				console.error('Erreur lors de la suppression de la catégorie:', err);
// 				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
// 			}
//
// 			if (result.affectedRows === 0) {
// 				return res.status(404).json({ message: 'Catégorie non trouvée' });
// 			}
//
// 			console.log('Catégorie supprimée avec succès:', result);
//
// 			// Supprimer l'image associée
// 			if (categoryImage) {
// 				const imagePath = path.join(__dirname, '..', categoryImage);
// 				fs.unlink(imagePath, (err) => {
// 					if (err) {
// 						console.error('Erreur lors de la suppression de l\'image de la catégorie:', err);
// 						return res.status(500).json({ message: 'Erreur lors de la suppression de l\'image de la catégorie', error: err.message });
// 					}
// 					console.log('Image de la catégorie supprimée avec succès:', imagePath);
// 				});
// 			}
//
// 			res.status(200).json({ message: 'Catégorie et image associée supprimées avec succès' });
// 		});
// 	});
// };

/** *******************************************************************
 * Cette fonction permet de modifier une catégorie
 * ********************************************************************/
exports.updateCategory = (req, res) => {
	const categoryId = req.params.categoryId;
	const { title, description } = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// Récupérer l'ancienne image avant la mise à jour
	const selectQuery = 'SELECT category_image FROM categories WHERE category_id = ?';
	db.query(selectQuery, [categoryId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image de la catégorie:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'ancienne image de la catégorie', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Catégorie non trouvée' });
		}

		const oldImage = results[0].category_image;

		// Mettre à jour la catégorie
		const updateQuery = `
            UPDATE categories
            SET category_title = ?, category_description = ?, category_image = COALESCE(?, category_image)
            WHERE category_id = ?
        `;
		db.query(updateQuery, [title, description, newImage, categoryId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la mise à jour de la catégorie:', err);
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Catégorie non trouvée' });
			}

			console.log('Catégorie modifiée avec succès:', result);

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

			res.status(200).json({ message: 'Catégorie modifiée avec succès' });
		});
	});
};

/** *******************************************************************
 * Cette fonction permet d'afficher toutes les photos d'une catégorie
 * ********************************************************************/
exports.showPhotosCategory = (req, res) => {
	const categoryId = req.params.categoryId;
	const query = `
        SELECT
        	p.photo_id,
            p.photo_image,
            p.photo_title,
            c.category_title,
            c.category_description
        FROM
            categories c
        LEFT JOIN
            photos p ON c.category_id = p.category_id
        WHERE
            c.category_id = ?
    `;

	db.query(query, [categoryId], (err, results) => {
		if (err) throw err;
		res.json(results);
	});
};

/** ************************************************************************************
 * Cette fonction permet d'afficher toutes les photos du site sur la page d'accueil
 * *************************************************************************************/
exports.showAllPhotos = (req, res) => {
	const query = `
        SELECT 
            photo_image,
            photo_title
        FROM 
            photos
    `;
	db.query(query, (err, results) => {
		if (err) {
			console.error('Error fetching photos:', err);
			return res.status(500).json({ error: 'An error occurred while fetching photos' });
		}
		res.json(results);
	});
};