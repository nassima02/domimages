import {useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import { useTheme} from '@mui/material/styles';
import {Box, CircularProgress, Divider, Tooltip, Typography} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import useGallery from "./useProjetsPhotos.jsx";
import GalleryDialog from "./photoDialog.jsx";
import {AuthContext} from "../../AuthContext.jsx";
import PhotoCarousel from './projetPhotoCarousel';
import '../../index.css';


const ProjetsPhotos = () => {
	const theme = useTheme();
	const {projetId} = useParams();
	const [carouselOpen, setCarouselOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
	const [projet, fetchGallery, images] = useGallery(projetId);
	const [imageLoadedCount, setImageLoadedCount] = useState(0);
	const {user} = useContext(AuthContext); // Accédez à l'utilisateur actuel
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const handleOpenGalleryDialog = () => {
		setOpenGalleryDialog(true);
	};

	const handleCloseGalleryDialog = () => {
		setOpenGalleryDialog(false);
	};

	const openCarousel = (index) => {
		setSelectedIndex(index);
		setCarouselOpen(true);
	};

	const closeCarousel = () => {
		setCarouselOpen(false);
	};

	const handlePrev = () => {
		setSelectedIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setSelectedIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
	};

	// Transformation des photos pour le composant Gallery
	const galleryImages = images.map(image => ({
		src: `${apiUrl}/thumbnails/${image.image_photo}`,
		width: image.width || 1, // Assurez-vous d'avoir une largeur pour chaque photo
		height: image.height || 1 // Assurez-vous d'avoir une hauteur pour chaque photo
	}));

	function imageLoaded() {
		setImageLoadedCount((count) => ++count);
	}
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				maxWidth: '1280px',
				width: '100%',
				padding: theme.spacing(2),
				margin: '0 auto',
				minHeight: 829,
			}}
		>
			{projet && projet.projet_title && (
				<Box
					sx={{
						position: 'relative',
						padding: theme.spacing(2),
						marginBottom: theme.spacing(4),
						textAlign: 'center',
						width: '100%',
						borderRadius: 2
					}}
				>
					<Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2}}>
						<Typography variant="h1" component="h1" sx={{color: 'var(--primary-main)', mb: 0}}>
							{projet.projet_title}
						</Typography>
						{user && user.isAdmin && (
							<Tooltip title="Ajouter une photo">
								<EditNoteIcon
									sx={{
										color: 'var(--primary-light)',
										fontSize: {
											xs: '1.5rem',
											sm: '1.75rem',
											md: '2rem',
										},
										cursor: 'pointer',
									}}
									onClick={handleOpenGalleryDialog}
								/>
							</Tooltip>
						)}
					</Box>
					<Typography variant="body1" component="p" sx={{color: 'var(--primary-main)', textAlign: 'left'}}>
						{projet.projet_description}
					</Typography>
					<Divider
						variant="middle"
						sx={{
							backgroundColor: 'var(--primary-main)',
							boxShadow: '0 2px 2px rgba(154, 137, 104, 1)',
							mt: '1.5rem',
						}}
					/>
				</Box>
			)}

			<Box className="gallery-container" sx={{ width: '100%' }}>
				{/* Affichage du spinner tant que toutes les images ne sont pas chargées */}
				{imageLoadedCount !== galleryImages.length && (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
						<CircularProgress />
					</Box>
				)}

				{/* Affichage des images une fois qu'elles sont toutes chargées */}
				{galleryImages.map((image, index) => (
					<Box key={index} className="gallery-item">
						<img
							src={image.src}
							alt={`Image ${index}`}
							onLoad={imageLoaded}
							onClick={() => openCarousel(index)}
							style={{ display: imageLoadedCount === galleryImages.length ? 'block' : 'none', cursor: 'pointer' }}
						/>
					</Box>
				))}
			</Box>

			<GalleryDialog
				open={openGalleryDialog}
				onClose={handleCloseGalleryDialog}
				title={"Photos"}
				images={images.map((image) => {
					return {
						...image,
						photo: `${apiUrl}/thumbnails/${image.image_photo}` // image miniatures ici
					};
				})}
				refreshGallery={fetchGallery}
			/>

			{carouselOpen && (
				<PhotoCarousel
					images={images.map((image) => {

						const fullImageUrl = `${apiUrl}/uploads/${image.image_photo}?w=162&auto=format`;
						return {
							...image,
							photo: fullImageUrl, // 'image taille réelle dans le carrousel
						};
					})}
					selectedIndex={selectedIndex}
					handlePrev={handlePrev}
					handleNext={handleNext}
					handleClose={closeCarousel}
				/>
			)}
		</Box>
	);
};

export default ProjetsPhotos;

