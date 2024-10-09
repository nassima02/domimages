import {useState, useContext} from 'react';
import {Box, Typography, useTheme, Divider, Tooltip,  CircularProgress} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import {useParams} from 'react-router-dom';
import {AuthContext} from "../../AuthContext.jsx";
import GalleryDialog from './GalleryDialog';
import useGallery from "./useGalleryPhotos.jsx";
import PhotoCarousel from './galleryPhotosCarousel';
import '../../index.css';


const PhotosGallery = () => {
	const theme = useTheme();
	const {categoryId} = useParams();
	const [carouselOpen, setCarouselOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
	const [category, fetchGallery, photos] = useGallery(categoryId);
	const [imageLoadedCount, setImageLoadedCount] = useState(0);
	const {user} = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL;

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
		setSelectedIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setSelectedIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
	};

	// Transformation des photos pour le composant Gallery
	const galleryImages = photos.map(photo => ({
		src: `${apiUrl}/thumbnails/${photo.photo_image}`,
		width: photo.width || 1, // Assurez-vous d'avoir une largeur pour chaque photo
		height: photo.height || 1 // Assurez-vous d'avoir une hauteur pour chaque photo
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
			{category && category.category_title && (
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
						<Typography variant="h1" component="h1" sx={{mb: 0}}>
							{category.category_title}
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
						{category.category_description}
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
				photos={photos.map((photo) => {
					return {
						...photo,
						photo_image: `${apiUrl}/thumbnails/${photo.photo_image}`
					};
				})}
				refreshGallery={fetchGallery}
			/>
			{carouselOpen && (
				<PhotoCarousel
					photos={photos.map((photo) => {
						const fullImageUrl = `${apiUrl}/uploads/${photo.photo_image}`;
						return {
							...photo,
							photo_image: fullImageUrl,
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

export default PhotosGallery;

//////////////////////////////////////////////////////////////////////////////////////////////////
//
// import {useContext, useState} from 'react';
// import {useParams} from "react-router-dom";
// import {AuthContext} from "../../AuthContext.jsx";
// import {styled, useTheme} from '@mui/material/styles';
// import {Box, Divider, Tooltip, Typography, useMediaQuery} from '@mui/material';
// import Masonry from '@mui/lab/Masonry';
// import EditNoteIcon from '@mui/icons-material/EditNote';
// import PhotoCarousel from './galleryPhotosCarousel';
// import useGallery from "./useGalleryPhotos.jsx";
// import GalleryDialog from "./galleryDialog.jsx";
//
// const HoverDiv = styled('div')({
// 	transition: 'transform 0.3s ease-in-out',
// 	position: 'relative',
// 	cursor: 'pointer',
// 	'&:hover': {
// 		transform: 'translateY(-5px)',
// 	},
// });
//
// const PhotosGallery = () => {
// 	const theme = useTheme();
// 	const isLg = useMediaQuery(theme.breakpoints.up('lg'));
// 	const isMd = useMediaQuery(theme.breakpoints.up('md'));
//
// 	// Define number of columns based on screen size
// 	let columns = 3;
// 	let spacing = 2;
// 	if (isLg) {
// 		columns = 3;
// 		spacing = 4;
// 	} else if (isMd) {
// 		columns = 2;
// 		spacing = 3;
// 	} else {
// 		columns = 1; // Single column for mobile screens
// 		spacing = 2;
// 	}
//
// 	const {categoryId} = useParams();
// 	const [carouselOpen, setCarouselOpen] = useState(false);
// 	const [selectedIndex, setSelectedIndex] = useState(0);
// 	const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
// 	const [category, fetchGallery, photos] = useGallery(categoryId);
// 	const {user} = useContext(AuthContext); // Accédez à l'utilisateur actuel
// 	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite
//
//
// 	const handleOpenGalleryDialog = () => {
// 		setOpenGalleryDialog(true);
// 	};
//
// 	const handleCloseGalleryDialog = () => {
// 		setOpenGalleryDialog(false);
// 	};
//
// 	const openCarousel = (index) => {
// 		setSelectedIndex(index);
// 		setCarouselOpen(true);
// 	};
//
// 	const closeCarousel = () => {
// 		setCarouselOpen(false);
// 	};
//
// 	const handlePrev = () => {
// 		setSelectedIndex(prevIndex => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
// 	};
//
// 	const handleNext = () => {
// 		setSelectedIndex(prevIndex => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
// 	};
//
// 	return (
// 		<Box
// 			sx={{
// 				display: 'flex',
// 				flexDirection: 'column',
// 				alignItems: 'center',
// 				maxWidth: '1280px',
// 				width: '100%',
// 				padding: theme.spacing(2),
// 				margin: '0 auto',
// 				minHeight: 829,
// 			}}
// 		>
// 			{category && category.category_title && (
// 				<Box
// 					sx={{
// 						position: 'relative',
// 						padding: theme.spacing(2),
// 						marginBottom: theme.spacing(4),
// 						textAlign: 'center',
// 						width: '100%',
// 						borderRadius: 2
// 					}}
// 				>
// 					<Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2}}>
// 						<Typography variant="h1" component="h1" sx={{mb: 0}}>
// 							{category.category_title}
// 						</Typography>
// 						{user && user.isAdmin && (
// 							<Tooltip title="Ajouter une photo">
// 								<EditNoteIcon
// 									sx={{
// 										color: 'var(--primary-light)',
// 										fontSize: {
// 											xs: '1.5rem',
// 											sm: '1.75rem',
// 											md: '2rem',
// 										},
// 										cursor: 'pointer',
// 									}}
// 									onClick={handleOpenGalleryDialog}
// 								/>
// 							</Tooltip>
// 						)}
// 					</Box>
// 					<Typography variant="body1" component="p" sx={{color: 'var(--primary-main)', textAlign: 'left'}}>
// 						{category.category_description}
// 					</Typography>
// 					<Divider
// 						variant="middle"
// 						sx={{
// 							backgroundColor: 'var(--primary-main)',
// 							boxShadow: '0 2px 2px rgba(154, 137, 104, 1)',
// 							mt: '1.5rem',
// 						}}
// 					/>
// 				</Box>
// 			)}
// 			<Masonry columns={columns} spacing={spacing}>
// 				{photos.length > 0 ? (
// 					photos.map((item, index) => (
// 						<HoverDiv key={index} onClick={() => openCarousel(index)}>
// 							<img
// 								srcSet={`${apiUrl}/thumbnails/${item.photo_image}?w=162&auto=format&dpr=2 2x`}
// 								src={`${apiUrl}/thumbnails/${item.photo_image}?w=162&auto=format`}
// 								alt={item.title}
// 								loading="lazy"
// 								style={{
// 									display: 'block',
// 									width: '100%',
// 									height: 'auto',
// 								}}
// 							/>
// 						</HoverDiv>
// 					))
// 				) : (
// 					<Typography variant="body1" component="p" sx={{color: 'var(--primary-main)'}}>
// 						Aucune photo trouvée dans cette catégorie.
// 					</Typography>
// 				)}
// 			</Masonry>
//
// 			<GalleryDialog
// 				open={openGalleryDialog}
// 				onClose={handleCloseGalleryDialog}
// 				title={"Photos"}
// 				photos={photos.map((photo) => {
// 					return {
// 						...photo,
// 						photo_image: `${apiUrl}/thumbnails/${photo.photo_image}` // image miniatures ici
// 					};
// 				})}
// 				refreshGallery={fetchGallery}
// 			/>
// 			{carouselOpen && (
// 				<PhotoCarousel
// 					photos={photos.map((photo) => {
// 						const fullImageUrl = `${apiUrl}/uploads/${photo.photo_image}?w=162&auto=format`;
// 						return {
// 							...photo,
// 							photo_image: fullImageUrl, // image miniatures ici
// 						};
// 					})}
// 					selectedIndex={selectedIndex}
// 					handlePrev={handlePrev}
// 					handleNext={handleNext}
// 					handleClose={closeCarousel}
// 				/>
// 			)}
// 		</Box>
// 	);
// };
//
// export default PhotosGallery;
