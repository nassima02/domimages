import {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContent, IconButton, Typography, useTheme} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import {styled} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close.js";

// Style des boutons de navigation du carousel
const StyledNavigateIcon = styled('div')(({theme}) => ({
	fontSize: 48,
	color: 'var(--primary-contrastText)',
	backgroundColor: 'transparent', // Fond transparent par défaut
	borderRadius: '50%',
	padding: 1,
	cursor: 'pointer',
	position: 'fixed',
	top: '50%',
	transform: 'translateY(-50%)',
	zIndex: 3000,
	'&:hover': {
		backgroundColor: 'rgba(250, 250, 250, 0.1)',
	},

	[theme.breakpoints.down('sm')]: {
		fontSize: 36,
	},
}));

const GalleryPhotosCarousel = ({photos, selectedIndex, handlePrev, handleNext, handleClose}) => {
	const [imageSize, setImageSize] = useState({width: 0, height: 0});
	const imageRef = useRef(null);
	const theme = useTheme();
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	// Récupération des images à afficher dans le carousel
	useEffect(() => {
		const img = new Image();
		img.src = `${apiUrl}/uploads/${photos[selectedIndex].photo_image}`;

		img.onload = () => {
			setImageSize({width: img.width, height: img.height});
		};
	}, [selectedIndex, photos]);

	// Récupération de la taille de l'image en cours d'affichage
	useEffect(() => {
		if (imageRef.current) {
			setImageSize({
				width: imageRef.current.clientWidth,
				height: imageRef.current.clientHeight,
			});
		}
	}, [selectedIndex]);

	return (
		<>
			{/* Bouton de fermeture à l'extérieur du carrousel, sur le fond */}
			<IconButton
				aria-label="close"
				onClick={handleClose}
				sx={{
					position: 'fixed',
					right: 16,
					top: 16,
					color: (theme) => theme.palette.grey[500],
					zIndex: 3000,
					'&:hover': {
						backgroundColor: 'rgba(250, 250, 250, 0.1)',
					},
				}}
			>
				<CloseIcon/>
			</IconButton>

			{/* Flèche de navigation précédente */}
			<StyledNavigateIcon
				as={NavigateBeforeIcon}
				onClick={handlePrev}
				sx={{
					left: 16, // Place la flèche à gauche
				}}
			/>

			{/* Flèche de navigation suivante */}
			<StyledNavigateIcon
				as={NavigateNextIcon}
				onClick={handleNext}
				sx={{
					right: 16, // Place la flèche à droite
				}}
			/>

			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="lg"
				fullWidth
				PaperProps={{
					style: {
						backgroundColor: 'transparent', // Cache la bordure blanche des photos du carousel
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						boxShadow: 'none',
					},
				}}
				sx={{
					'& .MuiDialog-container': {
						backgroundColor: 'var(--primary-main)', // Couleur de fond du carousel
					},
				}}
			>
				<DialogContent
					style={{
						position: 'relative',
						overflow: 'hidden',
						padding: 0,
						width: '100vw',    // Prend toute la largeur de l'écran
						height: '100vh',   // Prend toute la hauteur de l'écran
						display: 'flex',   // Utilisation de flexbox
						justifyContent: 'center',  // Centre horizontalement
						alignItems: 'center',      // Centre verticalement
					}}
				>
					<img
						ref={imageRef}
						src={photos[selectedIndex].photo_image}
						alt={photos[selectedIndex].photo_title}
						style={{
							maxWidth: '100%',
							maxHeight: '100%',
							objectFit: 'contain', // S'assure que l'image est entièrement visible
							display: 'block',     // Supprime les espaces blancs autour de l'image
						}}
					/>
				</DialogContent>

				{/* Titre en dehors de l'image */}
				<Typography
					variant="h2"
					component="h2"
					sx={{
						color: 'var(--primary-contrastText)',
						textAlign: 'center',
						marginTop: '15px',
						[theme.breakpoints.down('sm')]: {
							fontSize: '1rem',
							marginTop: '8px',
						},
					}}
				>
					{photos[selectedIndex].photo_title}
				</Typography>
			</Dialog>
		</>
	);
};

GalleryPhotosCarousel.propTypes = {
	photos: PropTypes.arrayOf(
		PropTypes.shape({
			photo_image: PropTypes.string.isRequired,
			photo_title: PropTypes.string.isRequired,
		})
	).isRequired,
	selectedIndex: PropTypes.number.isRequired,
	handlePrev: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleClose: PropTypes.func.isRequired,
};

export default GalleryPhotosCarousel;

