import axios from 'axios';
import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Typography
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function NewPassword() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage("Les mots de passe ne correspondent pas");
			return;
		}
		try {
			const response = await axios.post(`${apiUrl}/newPassword`, { token, password });
			if (response.data.success) {
				setMessage("Mot de passe réinitialisé avec succès");
				navigate('/login');
			} else {
				setMessage(response.data.message);
			}
		} catch (err) {
			console.error(err);
			setMessage("Une erreur est survenue");
		}
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
			<Typography variant="h1" component="h1" sx={{ color: 'var(--secondary-main)', mt: { xs: 2, lg: 8 }  }}>
				Réinitialiser votre mot de passe
			</Typography>

			{message && <p>{message}</p>}

			<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
				<FormControl sx={{ m: 1, width: '300px' }} variant="outlined">
					<InputLabel htmlFor="outlined-password">Nouveau mot de passe</InputLabel>
					<OutlinedInput
						id="outlined-password"
						type={showPassword ? 'text' : 'password'}
						value={password}
						autoComplete="off"
						onChange={(e) => setPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label="Nouveau mot de passe"
					/>
				</FormControl>
				<FormControl sx={{ m: 1, width: '300px' }} variant="outlined">
					<InputLabel htmlFor="outlined-confirmPassword">Confirmez le mot de passe</InputLabel>
					<OutlinedInput
						id="outlined-confirmPassword"
						type={showPassword ? 'text' : 'password'}
						value={confirmPassword}
						autoComplete="off"
						onChange={(e) => setConfirmPassword(e.target.value)}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label="Confirmez le mot de passe"
					/>
				</FormControl>
				<Button variant="contained" type="submit" sx={{
					width: {
						xs: '100%',
						sm: '200px',
						md: '250px',
						lg: '300px',
					},
					color: 'var(--secondary-main)',
					background: 'var(--primary-main)',
					border: '1px solid #D19326',
					fontWeight: 'bold',
					'&:hover': {
						background: 'var(--secondary-main)',
						color: 'white',
					},
				}}>
					Réinitialiser
				</Button>
			</form>
		</Box>
	);
}
