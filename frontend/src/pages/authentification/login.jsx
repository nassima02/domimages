import { useContext, useState } from 'react';
import axios from 'axios';
import {
	Box,
	IconButton,
	Typography,
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
	Alert,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../../AuthContext';
import Buttons from "../../assets/components/buttons.jsx";


export default function Login() {
	const { updateUser } = useContext(AuthContext);
	const [showPassword, setShowPassword] = useState(false);
	const [values, setValues] = useState({
		email: '',
		password: ''
	});
	const [error, setError] = useState('');
	const navigate = useNavigate();
	// const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const formStyles = {
		m: 1,
		width: '300px',
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--primary-main)',
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--primary-main)',
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: 'var(--primary-main)',
		},
		color: 'var(--primary-main)',
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.post(`http://localhost:4000/login`, values)
			.then(res => {
				console.log('Réponse du serveur:', res.data);
				if (res.data.Status === 'Success') {
					localStorage.setItem('userEmail', values.email);
					localStorage.setItem('token', res.data.token);
					updateUser(values.email);
					navigate('/');
				} else {
					setError(res.data.Error || 'Une erreur s\'est produite.');
				}
			})
			.catch(error => {
				console.log('Erreur Axios:', error);
				setError('Une erreur s\'est produite lors de la connexion. Veuillez réessayer.');
			});
	};

	const handleClickShowPassword = () => setShowPassword((show) => !show);

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
			<Typography variant="h1" component="h1" sx={{ mt: { xs: 2, lg: 8 }  }}>
				Connexion
			</Typography>
			{error && <Alert severity="error">{error}</Alert>}
			<form onSubmit={handleSubmit}>
				<TextField
					label="Email"
					id="outlined-email"
					InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
					InputProps={{
						style: { color: 'var(--primary-main)' },
						sx: formStyles,
					}}
					onChange={(e) => setValues({ ...values, email: e.target.value })}
				/>
				<FormControl  variant="outlined">
					<InputLabel htmlFor="outlined-adornment-password" sx={{ color: 'var(--primary-main)' }}>
						Mot de passe
					</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password"
						type={showPassword ? 'text' : 'password'}
						autoComplete="off"
						value={values.password}
						onChange={(e) => setValues({ ...values, password: e.target.value })}
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={handleClickShowPassword}
									onMouseDown={handleMouseDownPassword}
									edge="end"
									sx={{ color: 'var(--primary-main)' }}
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						label="Mot de passe"
						sx={formStyles}
					/>
				</FormControl>
				<Box
					sx={{
						display: 'flex',
						justifyContent:  'center',
						items:'center',
						gap: { xs: '10px', sm: '15px', md: '20px' },
						width: '100%',
						flexDirection: { xs: 'column', sm: 'row' },
					}}
				>
					<Box sx={{ display: 'flex',  mt: { xs: 2, sm: 4 }, width: { xs: '50%', sm: 'auto' },  alignSelf: 'center' }}>
						<Buttons text="Se connecter" onClick={handleSubmit} />
					</Box>
				</Box>
			</form>
			<Typography
				component={Link}
				to="/resetPassword"
				sx={{ color: 'var(--primary-main)', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
			>
				Mot de passe oublié ?
			</Typography>
		</Box>
	);
}
