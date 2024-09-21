import {useEffect, useState} from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import {Box, Typography, useMediaQuery, useTheme} from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const settings = {
	dots: false,
	infinite: true,
	speed: 2000,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 3000,
	fade: true,
	pauseOnHover: false,
	arrows: false,
};

function Accueil() {
	const [photos, setPhotos] = useState([]);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchPhotos = async () => {
			try {
				// Récupérer les photos depuis la table "photos"
				const photosResponse = await axios.get(`${apiUrl}/photos`);
				const photosData = photosResponse.data;

				// Récupérer les photos depuis la table "projet"
				const projetsResponse = await axios.get(`${apiUrl}/projets`);
				const projetsData = projetsResponse.data.map(projet => ({
					photo_image: projet.projet_image, // Assure que la structure des données est la même
					photo_title: projet.projet_title
				}));

				// Combiner les deux ensembles de données
				const combinedPhotos = [...photosData, ...projetsData];

				// Mettre à jour l'état avec les photos combinées
				setPhotos(combinedPhotos);
			} catch (error) {
				console.error('Error fetching photos or projects:', error);
			}
		};

		fetchPhotos();
	}, []);

	return (
		<Box
			sx={{
				flexGrow: 1,
				width: '100%',
				textAlign: 'center',
				margin: 'auto',
				paddingTop: '30px!important',
			}}
		>
			{photos.length > 0 ? (
				<Slider {...settings}>
					{photos.map((photo, index) => (
						<Box
							key={index}
							className="slider-container"
						>
							<img
								src={`${apiUrl}${photo.photo_image}`}
								alt={photo.photo_title}
								className="slider-image"
								style={{
									height: isSmallScreen ? 'auto' : '900px',
									width: '100%',
									objectFit: 'contain',
								}}
							/>
						</Box>
					))}
				</Slider>
			) : (
				<Typography variant="h6" sx={{color: '#fff'}}>
					Chargement des photos...
				</Typography>
			)}
		</Box>
	);
}

export default Accueil;
