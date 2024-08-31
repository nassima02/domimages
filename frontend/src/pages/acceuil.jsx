import { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
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
	pauseOnHover: true,
	arrows: false,
};

function Accueil() {
	const [photos, setPhotos] = useState([]);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	/** recupération de toutes les photos du site  **/
	useEffect(() => {
		axios.get(`${apiUrl}/photos`)
			.then(response => {
				setPhotos(response.data);
			})
			.catch(error => {
				console.error('Error fetching photos:', error);
			});
	}, []);

	return (
		<Box
			sx={{
				flexGrow: 1,
				width: '100%',
				textAlign: 'center',
				//maxHeight: 'calc(100vh - 64px)',
				// overflow: isSmallScreen? 'hidden': 'auto',
			}}
		>
			<Typography variant="h1" component="h1">
				{/*Bienvenue sur DomImages photographie*/}
			</Typography>
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
								}}
							/>
						</Box>
					))}
				</Slider>
			) : (
				<Typography variant="h6" sx={{ color: '#fff' }}>
					Chargement des photos...
				</Typography>
			)}
		</Box>
	);
}

export default Accueil;
