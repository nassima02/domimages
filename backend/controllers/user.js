require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db_config/db_config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {get} = require("axios");
const salt = 10;

const RECAPTCHA_SECRET_KEY = `${process.env.SECRET_KEY_RECAPTCHA}`;

const transporter = nodemailer.createTransport({
	host:"smtp-mail.outlook.com",
	secureConnection: false,
	port:587,
	tls:{
		ciphers:'SSLv3'
	},
	auth: {
		user: `${process.env.EMAIL_USER}`,
		pass: `${process.env.EMAIL_PASSWORD}`
	}
});

/**
 * Sends a password reset email to the user's email address.
 * @param {string} email - The email address of the user.
 * @param {string} resetLink - The link to reset the password.
 **/
function sendResetEmail(email, resetLink) {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: 'Réinitialisation du mot de passe',
		text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe: ${resetLink}`,
	};

	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.error(err);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}
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

/** *******************************************************************
 * cette fonction permet d'envoyer par mail un lien
 * de reinitialisation de mot de passe de l'utilisateur
 * ********************************************************************/
exports.resetPassword = (req, res) => {
	const { email } = req.body;

	const resetToken = crypto.randomBytes(32).toString('hex');
	const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 heure

	db.query(
		'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
		[resetToken, resetTokenExpiration, email],
		(err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Erreur interne du serveur' });
			}

			if (result.affectedRows === 0) {
				return res.status(400).json({ message: 'Aucun utilisateur trouvé avec cet email' });
			}

			const resetLink = `http://localhost:5173/newPassword/${resetToken}`;
			sendResetEmail(email, resetLink);
			res.json({ message: 'Email de réinitialisation envoyé' });
		}
	);
};

/** *****************************************************************
 * cette fonction permet à l'utilisateur de changer son mot de passe
 *  ******************************************************************/
exports.newPassword = (req, res) => {
	const { token, password } = req.body;

	db.query(
		'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()',
		[token],
		async (err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: 'Erreur interne du serveur' });
			}

			if (result.length === 0) {
				return res.status(400).json({ message: 'Token invalide ou expiré' });
			}

			const user = result[0];
			const hashedPassword = await bcrypt.hash(password, 10);

			db.query(
				'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?',
				[hashedPassword, token],
				(err, result) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'Erreur interne du serveur'  });
					}
					res.json({ success: true, message: 'Mot de passe réinitialisé avec succès' });
				}
			);
		}
	);
};

/** *****************************************************************
 * cette fonction permet de récupérer les informations d'un utilisateur
 *  par son ID
 *  ******************************************************************/
exports.getUserProfile = (req, res) => {
	const userEmail = req.params.email;

	// Requête SQL pour obtenir les informations de l'utilisateur
	const query = 'SELECT first_name, last_name, email, profile_picture, isAdmin FROM users WHERE email = ?';

	db.query(query, [userEmail], (err, results) => {
		if (err) {
			console.error('Erreur lors de la récupération de l\'utilisateur:', err);
			return res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des données de l\'utilisateur' });
		}

		if (results.length === 0) {
			return res.status(404).json({ error: 'Utilisateur non trouvé' });
		}
		res.json(results[0]); // Envoyer les données de l'utilisateur
	});
};

/** *****************************************************************************
 * cette fonction permet de d'envoyer un message à partir du formulaire de contact
 *  *******************************************************************************/
exports.contact = async (req, res) => {
	const { name, email, sujet, message, captchaToken  } = req.body;

	if (!name || !email || !sujet || !message || !captchaToken) {
		return res.status(400).json({ success: false, message: 'Données manquantes ou incorrectes' });
	}
	// Vérification du captcha
	try {
		const response = await get('https://www.google.com/recaptcha/api/siteverify',  {
			params: {
				secret: RECAPTCHA_SECRET_KEY,
				response: captchaToken
			}
		});

		if (!response.data.success) {
			// Le captcha est invalide, renvoyer une erreur
			return res.status(400).json({ success: false, message: 'Captcha invalide' });
		}
	} catch (error) {
		console.error('Erreur lors de la validation du captcha:', error);
		return res.status(500).json({ success: false, message: 'Erreur lors de la validation du captcha' });
	}
	// Si le captcha est valide, envoyer l'e-mail
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: 'dominiquebression@gmail.com',
		subject: 'Nouveau formulaire de contact',
		text: `Nom: ${name}\nEmail: ${email}\nSujet: ${sujet}\nMessage: ${message}`,
		replyTo: email,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log('Contact email sent:', info.response);
		res.status(200).json({ success: true, message: 'E-mail envoyé avec succès' });
	} catch (error) {
		console.error('Erreur lors de l\'envoi de l\'e-mail de contact:', error);
		res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'e-mail de contact' });
	}
};
