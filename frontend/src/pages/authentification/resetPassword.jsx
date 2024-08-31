import  { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, TextField } from '@mui/material';

export default function ResetPassword() {
	const [values, setValues] = useState({ email: '' });
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	// Utilisation des variables d'environnement avec Vite
	const apiUrl = import.meta.env.VITE_API_URL;

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			const response = await axios.post(`${apiUrl}/resetPassword`, { email: values.email });
			setMessage(response.data.message);
			setError('');
		} catch (err) {
			setError(err.response?.data?.message || "Erreur lors de la vérification de l'adresse e-mail.");
			setMessage('');
		}
	};

	return (

		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', textAlign: 'center'}}>
			<Typography variant="h1" component="h1" sx={{ color: 'var(--secondary-main)', mt: { xs: 2, lg: 8 }}}>
				Réinitialisation du mot de passe
			</Typography>
			<Typography
				variant="h6"
				component="h2"
				sx={{
					color: 'var(--primary-main)',
					mb: 2,
				}}
			>
				Veuillez entrer votre adresse e-mail
			</Typography>

			<form onSubmit={handleSubmit}>
				<TextField
					label="Email"
					id="outlined-email"
					sx={{ m: 1, width: '300px' }}
					onChange={(e) => setValues({ ...values, email: e.target.value })}
				/>
				<Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', width: '100%' }}>
					<Button variant="contained" type="submit" sx={{
						width: {
							xs: '300px',
							sm: '200px',
							md: '250px',
							lg: '300px',
						},
						mt:2,
						color: 'var(--secondary-main)',
						background: 'var(--primary-main)',
						border: '1px solid #D19326',
						fontWeight: 'bold',
						'&:hover': {
							background: 'var(--secondary-main)',
							color: 'white',
						},
					}}>
						Envoyer
					</Button>
				</Box>
			</form>
			{message && <Typography sx={{ color: 'green' }}>{message}</Typography>}
			{error && <Typography sx={{ color: 'red' }}>{error}</Typography>}
		</Box>
	);
}