require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db_config/db_config');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const {get} = require("axios");
const salt = 10;
/*******************************************************************
 cette fonction permet de vérifier si un utilisateur existe dans la
 base de données et si le MDP transmis correspond à cet utilisateur
 *******************************************************************/
exports.login = (req, res) => {
	console.log("Demande de login reçue");
	const sql = "SELECT * FROM users WHERE email = ?";

	db.query(sql, [req.body.email], (err, data) => {
		if (err) {
			console.error("Erreur de requête de base de données :", err);
			return res.status(500).json({ Error: "Erreur de login" });
		}
		if (data.length > 0) {
			bcrypt.compare(req.body.password, data[0].password, (err, response) => {
				if (err) {
					console.error("Erreur de comparaison de mot de passe :", err);
					return res.status(500).json({ Error: "Erreur de comparaison de mot de passe" });
				}
				if (response) {
					console.log("Login réussi");
					return res.json({ Status: "Success" });
				} else {
					console.log("Mot de passe incorrect");
					return res.json({ Error: "Mot de passe incorrect" });
				}
			});
		} else {
			console.log("Email n'existe pas");
			return res.json({ Error: "Email n'existe pas" });
		}
	});
};
