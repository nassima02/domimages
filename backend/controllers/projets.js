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
	const { title, description } = req.body;
	const projet_image = req.file ? `/uploads/${req.file.filename}` : null;

	if (!title || !projet_image) {
		return res.status(400).json({ message: 'Titre et image  sont obligatoires' });
	}

	const query = 'INSERT INTO projets (projet_title, projet_image, projet_description) VALUES (?, ?, ?)';
	db.query(query, [title, projet_image, description], (err, result) => {
		if (err) {
			console.error('Database query failed:', err);
			return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
		}
		res.status(201).json({ message: 'Projet ajoutée avec succès' });
	});
};

/*********************************************************************
 * Cette fonction permet de supprimer un projet
 * ********************************************************************/
exports.deleteProjet = (req, res) => {
	const projetId = req.params.projetId;

	// Récupérer l'image du projet avant de la supprimer
	const selectQuery = 'SELECT projet_image FROM projets WHERE projet_id = ?';
	db.query(selectQuery, [projetId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'image du projet:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'image du projet', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Projet non trouvée' });
		}

		const projetImage = results[0].projet_image;

		// Supprimer le projet de la base de données
		const deleteQuery = 'DELETE FROM projets WHERE projet_id = ?';
		db.query(deleteQuery, [projetId], (err, result) => {
			if (err) {
				console.error('Erreur lors de la suppression du projet:', err);
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Projet non trouvée' });
			}

			// Supprimer l'image associée
			if (projetImage) {
				const imagePath = path.join(__dirname, '..', projetImage);
				fs.unlink(imagePath, (err) => {
					if (err) {
						console.error('Erreur lors de la suppression de l\'image du projet:', err);
						return res.status(500).json({ message: 'Erreur lors de la suppression de l\'image du projet', error: err.message });
					}
					console.log('Image du projet supprimée avec succès:', imagePath);
				});
			}

			res.status(200).json({ message: 'Projet et image associée supprimées avec succès' });
		});
	});
};

/** *******************************************************************
 * Cette fonction permet de modifier un projet
 * ********************************************************************/
exports.updateProjet = (req, res) => {
	const projetId = req.params.projetId;
	const { title, description } = req.body;
	const newImage = req.file ? `/uploads/${req.file.filename}` : null;

	// Récupérer l'ancienne image avant la mise à jour
	const selectQuery = 'SELECT projet_image FROM projets WHERE projet_id = ?';
	db.query(selectQuery, [projetId], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'ancienne image du projet:', err);
			return res.status(500).json({ message: 'Erreur lors de la récupération de l\'ancienne image du projet', error: err.message });
		}

		if (results.length === 0) {
			return res.status(404).json({ message: 'Projet non trouvée' });
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
				return res.status(500).json({ message: 'Erreur de base de données', error: err.message });
			}

			if (result.affectedRows === 0) {
				return res.status(404).json({ message: 'Projet non trouvée' });
			}
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

			res.status(200).json({ message: 'Projet modifiée avec succès' });
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
		if (err) throw err;
		res.json(results);
	});
};