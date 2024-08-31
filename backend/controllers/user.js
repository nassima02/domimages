require('dotenv').config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db_config/db_config');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const salt = 10;

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
		subject: 'Password Reset',
		text: `Click the following link to reset your password: ${resetLink}`,
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
				return res.status(500).json({ message: 'Internal server error' });
			}

			if (result.affectedRows === 0) {
				return res.status(400).json({ message: 'No user with that email' });
			}

			const resetLink = `http://localhost:5173/newPassword/${resetToken}`;
			sendResetEmail(email, resetLink);
			res.json({ message: 'Reset email sent' });
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
				return res.status(500).json({ message: 'Internal server error' });
			}

			if (result.length === 0) {
				return res.status(400).json({ message: 'Invalid or expired token' });
			}

			const user = result[0];
			const hashedPassword = await bcrypt.hash(password, 10);

			db.query(
				'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?',
				[hashedPassword, token],
				(err, result) => {
					if (err) {
						console.error(err);
						return res.status(500).json({ message: 'Internal server error' });
					}

					res.json({ success: true, message: 'Password reset successfully' });
				}
			);
		}
	);
};
