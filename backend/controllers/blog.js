const { db } = require("../db_config/db_config");
const path = require('path');
const fs = require("fs");

/** *******************************************************************
 * Cette fonction permet d'ajouter un nouveau article de blog
 * ********************************************************************/
exports.addArticle = (req, res) => {
	const { title, url, description } = req.body;
	const image = req.file ? `/uploads/${req.file.filename}` : null; // Nom du fichier image

	if (!title) {
		return res.status(400).json({ message: 'Titre et URL sont requis' });
	}

	try {
		// Insertion dans la base de données
		const query = 'INSERT INTO articles (title, url, image, description, created_at) VALUES (?, ?, ?, ?, NOW())';
		db.query(query, [title, url, image, description], (err, result) => {
			if (err) {
				console.error('Erreur lors de l\'ajout de l\'article:', err);
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}
			res.status(201).json({ message: 'Article ajouté avec succès', articleId: result.insertId });
		});
	} catch (err) {
		console.error('Erreur lors de l\'ajout de l\'article:', err);
		res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'article', error: err.message });
	}
};

/** *******************************************************************
 * Cette fonction permet d'obtenir tous les articles de blog
 * ********************************************************************/
exports.getArticles = (req, res) => {
	const query = 'SELECT * FROM articles ORDER BY created_at DESC';
	db.query(query, (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération des articles:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}
		res.status(200).json(results);
	});
};

/** *******************************************************************
 * Cette fonction permet de modifier un article de blog
 * ********************************************************************/
exports.updateArticle = (req, res) => {
	const articleId = req.params.articleId;
	const { title, url, description } = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// Récupérer l'ancienne image avant la mise à jour
	const selectQuery = 'SELECT image FROM articles WHERE article_id = ?';
	db.query(selectQuery, [articleId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image de l\'article:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'ancienne image de l\'article', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Article non trouvée' });
		}

		const oldImage = results[0].image;

		// Mettre à jour la catégorie
		const updateQuery = `
            UPDATE articles
            SET title = ?, description = ?, image = COALESCE(?, image)
            WHERE article_id = ?
        `;
		db.query(updateQuery, [title, description, newImage, articleId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la mise à jour de l\'article:', err);
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Article non trouvée' });
			}

			console.log('Article modifiée avec succès:', result);

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
			res.status(200).json({ message: 'Article modifiée avec succès' });
		});
	});
};

/** *******************************************************************
 * Cette fonction permet de supprimer un article de blog
 * ********************************************************************/
exports.deleteArticle = (req, res) => {
	const articleId = req.params.articleId;

	// Récupérer l'image associée
	const getImageQuery = 'SELECT image FROM articles WHERE article_id = ?';
	db.query(getImageQuery, [articleId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'image:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}

		const image = results[0]?.image;

		// Supprimer l'article
		const deleteQuery = 'DELETE FROM articles WHERE article_id = ?';
		db.query(deleteQuery, [articleId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la suppression de l\'article:', err);
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Article non trouvé' });
			}

			// Supprimer l'image associée
			if (image) {
				const imagePath = path.join(__dirname, '..', image);
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'image:', err);
					}
				});
			}

			res.status(200).json({ message: 'Article supprimé avec succès' });
		});
	});
};
