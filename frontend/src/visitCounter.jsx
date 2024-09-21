import {useEffect, useState} from "react";
import axios from "axios";
import {Box, Typography} from "@mui/material";
import {useTheme} from '@mui/material/styles';
import useMediaQuery from "@mui/material/useMediaQuery";

function VisitCounter() {
	const theme = useTheme();
	const [visitCount, setVisitCount] = useState(null);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	useEffect(() => {
		const hasVisited = localStorage.getItem("hasVisited") ?? false;
		if (!hasVisited) {
			localStorage.setItem("hasVisited", "true");
			console.log("Appel de l'API pour incrémenter les visites");
			axios.post(`${apiUrl}/incrementVisit`)
				.then(response => {
					if (response.status === 200) {
						console.log("incrémentation ok")
					}
				})
				.catch(error => {
					localStorage.setItem("hasVisited", "false");
					console.error('Erreur lors de la sauvegarde de la visite:', error)
				});
		}
		axios.get(`${apiUrl}/totalVisits`)
			.then(response => {
				setVisitCount(response.data.visits);
			})
			.catch(error => {
				console.error('Erreur lors de la récupération des visites:', error);
				setVisitCount('Erreur de récupération');
			});
	}, []);

	return (
		<Box>
			{visitCount !== null ? (
				<Typography
					variant="body2"
					sx={{
						mb: isSmallScreen ? 0.5 : 0,
						fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
						color: 'var(--primary-contrastText)',
					}}
				>
					Nombre de visites : {visitCount}
				</Typography>
			) : (
				<Typography
					variant="body2"
					sx={{
						mb: isSmallScreen ? 0.5 : 0,
						fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
						color: 'var(--primary-contrastText)',
					}}
				>
					Chargement du nombre de visites...
				</Typography>
			)}
		</Box>
	);
}

export default VisitCounter;