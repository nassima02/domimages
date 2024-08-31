const {db} = require("../db_config/db_config");
const { v4: uuidv4 } = require('uuid');
/** *******************************************************************
 *  Cette fonction permet d'ajouter un nouveau avis utilisateur
 * ********************************************************************/
exports.addAvis = (req, res) => {
	const { name, comment } = req.body;
	const id = uuidv4(); // Génère un UUID valide
	const createdAt = new Date(); // Récupère la date et l'heure actuelles
	const query = 'INSERT INTO avis (id, name, comment, created_at) VALUES (?, ?, ?, ?)';

	db.query(query, [id, name, comment, createdAt], (err, result) => {
		if (err) {
			console.error('Error inserting review:', err);
			return res.status(500).send('Error adding review');
		}
		res.json({ id, name, comment, created_at: createdAt });
	});
};

/** *******************************************************************
 *  Cette fonction permet d'obtenir les avis
 * ********************************************************************/
exports.allAvis = (req, res) => {
	const query = `
        SELECT a.id, a.name, a.comment, a.created_at,
               r.id AS reply_id, r.reply, r.created_at AS reply_created_at,
               r.name as reply_name
        FROM avis a
        LEFT JOIN replies r ON a.id = r.comment_id
        ORDER BY a.created_at DESC, r.created_at ASC
    `;

	db.query(query, (err, results) => {
		if (err) {
			console.error('Error fetching reviews:', err);
			return res.status(500).send('Error fetching reviews');
		}

		// Group replies by avis
		const avisMap = {};
		results.forEach(row => {
			if (!avisMap[row.id]) {
				avisMap[row.id] = {
					id: row.id,
					name: row.name,
					comment: row.comment,
					created_at: row.created_at,
					replies: []
				};
			}
			if (row.reply_id) {
				avisMap[row.id].replies.push({
					id: row.reply_id,
					reply: row.reply,
					created_at: row.reply_created_at,
					name: row.reply_name
				});
			}
		});

		res.json(Object.values(avisMap));
	});
};

/** *******************************************************************
 *  Cette fonction permet de répondre à un avis
 * ********************************************************************/
exports.answerAvis = (req, res) => {
	const { id } = req.params;
	const { reply } = req.body;
	console.log(id, reply);
	console.log(typeof id, typeof reply)
	// Validation des données
	if (typeof reply?.comment !== 'string') {
		return res.status(400).json({ error: 'Invalid input' });
	}

	const replyId = uuidv4();
	const createdAt = new Date();

	// Requête pour insérer la réponse
	const query = 'INSERT INTO replies (id, comment_id, reply, created_at, name) VALUES (?, ?, ?, ?,?)';

	db.query(query, [replyId, id, reply.comment, createdAt, reply.name], (err) => {
		if (err) {
			console.error('Error inserting reply:', err);
			return res.status(500).json({ error: 'Error adding reply' });
		}

		// Récupère la réponse ajoutée
		const getQuery = 'SELECT * FROM replies WHERE id = ?';
		db.query(getQuery, [replyId], (err, rows) => {
			if (err) {
				console.error('Error fetching added reply:', err);
				return res.status(500).json({ error: 'Error fetching added reply' });
			}

			if (rows.length === 0) {
				return res.status(404).json({ error: 'Reply not found' });
			}

			res.json(rows[0]);
		});
	});
};

/** *******************************************************************
 *  Cette fonction permet de supprimer un avis ainsi que ses réponses associées
 * ********************************************************************/
exports.deleteAvis = (req, res) => {
	const { id } = req.params; // id est l'UUID de l'avis

	// Requête pour supprimer les réponses associées à l'avis
	const deleteRepliesQuery = 'DELETE FROM replies WHERE comment_id = ?';

	// Requête pour supprimer l'avis lui-même
	const deleteReviewQuery = 'DELETE FROM avis WHERE id = ?';

	// Commencer par supprimer les réponses
	db.query(deleteRepliesQuery, [id], (err, result) => {
		if (err) {
			console.error('Error deleting replies:', err);
			return res.status(500).send('Error deleting replies');
		}

		// Puis supprimer l'avis
		db.query(deleteReviewQuery, [id], (err, result) => {
			if (err) {
				console.error('Error deleting review:', err);
				return res.status(500).send('Error deleting review');
			}

			// Si tout est supprimé avec succès
			res.status(204).send(); // 204 No Content signifie que la requête a été traitée avec succès mais qu'il n'y a aucun contenu à renvoyer.
		});
	});
};

/** *******************************************************************
 *  Cette fonction permet de supprimer une réponse spécifique associée à un avis
 * ********************************************************************/
exports.deleteReply = (req, res) => {
	const { commentId, replyId } = req.params; // commentId est l'UUID de l'avis, replyId est l'UUID de la réponse

	// Requête pour supprimer la réponse spécifique
	const deleteReplyQuery = 'DELETE FROM replies WHERE id = ? AND comment_id = ?';

	db.query(deleteReplyQuery, [replyId, commentId], (err, result) => {
		if (err) {
			console.error('Error deleting reply:', err);
			return res.status(500).send('Error deleting reply');
		}

		// Vérifier si la suppression a affecté une ligne (c'est-à-dire si la réponse existait)
		if (result.affectedRows === 0) {
			return res.status(404).send('Reply not found'); // Si aucune ligne n'est affectée, retourner une erreur 404
		}

		// Si la réponse est supprimée avec succès
		res.status(204).send();
	});
};