const {db} = require("../db_config/db_config");

/** *******************************************************************
 * Cette fonction permet de récupérer le nombre de visites
 * ********************************************************************/
exports.allVisits = (req, res) => {
	const query =  'SELECT visits FROM site_stats WHERE id = 1';

	db.query(query, (err, result) => {
		if (err) {
			return res.status(500).json({ error: 'Erreur lors de la récupération des visites.' });
		}
		res.json({ visits: result[0].visits });
	});
};

/** *******************************************************************
 * Cette fonction permet d'incrémenter le nombre de visites
 * ********************************************************************/
exports.compterVisits = async (req, res) => {
	try {
		console.log('Incrémentation de la visite'); // Log avant la mise à jour
		await db.query('UPDATE site_stats SET visits = visits + 1 WHERE id = 1');
		console.log('Visite enregistrée'); // Log après la mise à jour
		res.status(200).send("Visite enregistrée avec succès !");
	} catch (error) {
		console.error('Erreur lors de la mise à jour des visites', error);
		res.status(500).send("Erreur serveur.");
	}
};