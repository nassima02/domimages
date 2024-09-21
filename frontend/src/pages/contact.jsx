import {useForm} from 'react-hook-form';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TextField, Button, Container, Typography} from '@mui/material';
import {useEffect, useState} from 'react';

const SITE_KEY_RECAPTCHA = '6LdUBjQqAAAAAImNcNTAynI7c6Y2t9fEEbZAtO0H';

const Contact = () => {
	const {register, handleSubmit, formState: {errors}, reset, watch} = useForm();
	const [isDisabled, setIsDisabled] = useState(true);
	const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	// Surveille les valeurs des champs 'email' et 'message'
	const email = watch('email');
	const message = watch('message');

	// Met à jour l'état `isDisabled` en fonction des valeurs des champs
	useEffect(() => {
		setIsDisabled(!email || !message);
	}, [email, message]);

	// Charge le script reCAPTCHA
	useEffect(() => {
		const loadRecaptcha = () => {
			const script = document.createElement('script');
			script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY_RECAPTCHA}`;
			script.async = true;
			script.defer = true;
			script.onload = () => setRecaptchaLoaded(true);
			document.body.appendChild(script);
		};

		loadRecaptcha();
	}, []);

	// Fonction de soumission du formulaire
	const handleFormSubmit = async (data) => {
		if (recaptchaLoaded) {
			window.grecaptcha.ready(async () => {
				try {
					const token = await window.grecaptcha.execute(SITE_KEY_RECAPTCHA, {action: 'submit'});
					data.captchaToken = token;
					console.log(data); // Vérifiez les données envoyées

					const response = await fetch(`${apiUrl}/submit-form`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(data),
					});

					const result = await response.json();

					if (response.ok && result.success) {
						toast.success('Message envoyé avec succès !');
						reset(); // Réinitialiser le formulaire
					} else {
						toast.error(result.message || 'Erreur lors de l\'envoi du message.');
					}
				} catch {
					toast.error('Erreur lors de l\'envoi du message.');
				}
			});
		} else {
			toast.error('reCAPTCHA n\'est pas encore chargé.');
		}
	};

	return (
		<Container maxWidth='sm' sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: '30px 0 0 0',
		}}>
			<Typography variant="h1" component="h1" sx={{textWrap: 'nowrap'}}>
				ME CONTACTER
			</Typography>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<Typography variant="body1">
					Vous souhaitez prendre contact ? N&apos;hésitez pas à me laisser un message en utilisant le
					formulaire ci-dessous ou directement à l&apos;adresse e-mail suivante:
					<strong> domimages@alwaysdata.net</strong> <br/><br/>
					Je vous répondrai rapidement.
				</Typography>
				<TextField
					fullWidth
					label="Nom et prénom"
					variant="outlined"
					margin="normal"
					{...register('name', {required: 'Ce champ est obligatoire'})}
					error={!!errors.name}
					helperText={errors.name ? errors.name.message : ''}
					sx={{background: "#fff"}}
				/>
				<TextField
					fullWidth
					label="Email"
					variant="outlined"
					margin="normal"
					type="email"
					{...register('email', {required: 'Ce champ est obligatoire'})}
					error={!!errors.email}
					helperText={errors.email ? errors.email.message : ''}
					sx={{background: "#fff"}}
				/>
				<TextField
					fullWidth
					label="Sujet"
					variant="outlined"
					margin="normal"
					{...register('sujet', {required: 'Ce champ est obligatoire'})}
					error={!!errors.sujet}
					helperText={errors.sujet ? errors.sujet.message : ''}
					sx={{background: "#fff"}}
				/>
				<TextField
					fullWidth
					label="Message"
					variant="outlined"
					margin="normal"
					multiline
					rows={4}
					{...register('message', {required: 'Ce champ est obligatoire'})}
					error={!!errors.message}
					helperText={errors.message ? errors.message.message : ''}
					sx={{background: "#fff"}}
				/>

				<Button
					type="submit"
					variant="contained"
					color="primary"
					disabled={isDisabled}
					sx={{
						backgroundColor: 'var(--secondary-main)',
						color: 'var(--primary-main)',
						fontWeight: 'bold',
						mb: 3,
						mt: 2,
						'&:disabled': {
							backgroundColor: 'var(--primary-main)',
							color: 'var(--secondary-main)',
						},
						'&:hover': {
							backgroundColor: 'var(--secondary-main)',
							color: 'var(--primary-main)'
						},
					}}
				>
					Envoyer
				</Button>
			</form>
			<ToastContainer/>
		</Container>
	);
};

export default Contact;