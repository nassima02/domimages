import {useContext, useState} from 'react';
import { useParams } from "react-router-dom";
import { styled, useTheme } from '@mui/material/styles';
import {Box, Divider, Tooltip, Typography, useMediaQuery} from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import EditNoteIcon from '@mui/icons-material/EditNote';
import useGallery from "./useProjetsPhotos.jsx";
import GalleryDialog from "./photoDialog.jsx";
import {AuthContext} from "../../AuthContext.jsx";
import PhotoCarousel from './projetPhotoCarousel';

const HoverDiv = styled('div')({
	transition: 'transform 0.3s ease-in-out',
	position: 'relative',
	cursor: 'pointer',
	'&:hover': {
		transform: 'translateY(-5px)',
	},
});

const ProjetsPhotos = () => {
	const theme = useTheme();
	const isLg = useMediaQuery(theme.breakpoints.up('lg'));
	const isMd = useMediaQuery(theme.breakpoints.up('md'));

	// Define number of columns based on screen size
	let columns = 3;
	let spacing = 2;
	if (isLg) {
		columns = 3;
		spacing = 4;
	} else if (isMd) {
		columns = 2;
		spacing = 3;
	} else {
		columns = 1; // Single column for mobile screens
		spacing = 2;
	}

	const { projetId } = useParams();
	const [carouselOpen, setCarouselOpen] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [openGalleryDialog, setOpenGalleryDialog] = useState(false);
	const [projet, fetchGallery, images] = useGallery(projetId);
	const { user } = useContext(AuthContext); // Accédez à l'utilisateur actuel
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

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
			{projet && (
				<Box
					sx={{
						position: 'relative',
						padding: theme.spacing(2),
						// background: 'var(--primary-main)',
						marginBottom: theme.spacing(4),
						textAlign: 'center',
						width:'100%'
					}}
				>
					<Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
						<Typography variant="h1" component="h1" sx={{ color: 'var(--primary-main)', mb:0 }}>
							{projet.projet_title}
						</Typography>
						{user && user.isAdmin && ( // Vérifiez si l'utilisateur est admin avant d'afficher l'icône
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
					<Typography variant="body1" component="p" sx={{ color: 'var(--primary-main)', textAlign: 'left'}}>
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

			<Masonry columns={columns} spacing={spacing}>
				{images.length > 0 ? (
					images.map((item, index) => (
						<HoverDiv key={index} onClick={() => openCarousel(index)}>
							<img
								srcSet={`${apiUrl}${item.image_photo}?w=162&auto=format&dpr=2 2x`}
								src={`${apiUrl}${item.image_photo}?w=162&auto=format`}
								alt={item.title}
								loading="lazy"
								style={{
									display: 'block',
									width: '100%',
									height: 'auto',
								}}
							/>
						</HoverDiv>
					))
				) : (
					<Typography variant="body1" component="p" >
						Aucune photo trouvée dans ce projet.
					</Typography>
				)}
			</Masonry>

			<GalleryDialog
				open={openGalleryDialog}
				onClose={handleCloseGalleryDialog}
				title={"Photos"}
				images={images}
				refreshGallery={fetchGallery}
			/>
			{carouselOpen && (
				<PhotoCarousel
					images={images}
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