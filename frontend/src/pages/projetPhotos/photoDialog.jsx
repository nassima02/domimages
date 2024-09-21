import PropTypes from "prop-types";
import axios from "axios";
import {useState} from "react";
import {Dialog, DialogContent, DialogTitle, Box, Grid, Tooltip, IconButton} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Buttons from "../../components/buttons.jsx";
import UpdatePhotoProjetDialog from "./updatePhotoProjetDialog.jsx";

function PhotoDialog({open, onClose, title, images, refreshGallery}) {

	const [openModal, setOpenModal] = useState(false);
	const [photoToEdit, setPhotoToEdit] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const handleOpenDialog = () => {
		setOpenModal(true);
	};

	const handleCloseDialog = () => {
		setOpenModal(false);
		setPhotoToEdit(null);
	};

	const handleEditPhoto = (image) => {
		setPhotoToEdit(image);
		handleOpenDialog();
	};

	const handleDeletePhoto = (imageId) => {
		if (window.confirm("Voulez-vous vraiment supprimer cette photo?")) {
			axios.delete(`${apiUrl}/images/${imageId}`)
				.then(res => {
					console.log('Photo supprimée:', res.data);
					refreshGallery(); // Rafraîchir la galerie globale
				})
				.catch(error => {
					console.error('Erreur lors de la suppression de la photo:', error);
				});
		}
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				{title}
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon/>
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{paddingTop: 1}}>
					<Grid container spacing={2} justifyContent="center">
						{images?.map((image) => (
							<Grid key={image.image_id} item xs={12} sm={6} md={4} lg={3} sx={{p: 1}}>
								<Box
									sx={{
										position: 'relative',
										height: 110,
										width: '100%',
										overflow: 'hidden',
										boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
									}}
								>
									<img
										src={`${apiUrl}/thumbnails/${image.image_photo}`}
										alt={`Photo ${image.image_id}`}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											objectPosition: 'center 25%',
										}}
									/>
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
											color: '#fff',
											zIndex: 1,
											p: 1,
											textAlign: 'center',
										}}
									>
										<Box
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												display: 'flex',
												gap: 1,
												zIndex: 2,
											}}
										>
											<Tooltip title="Supprimer">
												<IconButton
													onClick={() => handleDeletePhoto(image.image_id)}
												>
													<DeleteIcon sx={{color: 'white', fontSize: '1.2rem'}}/>
												</IconButton>
											</Tooltip>
											<Tooltip title="Modifier">
												<IconButton
													onClick={() => handleEditPhoto(image)}
												>
													<EditIcon sx={{color: 'white', fontSize: '1.2rem'}}/>
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</DialogContent>
			<Box sx={{display: 'flex', justifyContent: 'center', m: 3}}>
				<Buttons text="Ajouter une photo" onClick={handleOpenDialog}/>
			</Box>
			<UpdatePhotoProjetDialog
				open={openModal}
				onClose={handleCloseDialog}
				title={photoToEdit ? "Modifier la photo" : "Ajouter une photo"}
				refreshGallery={refreshGallery}
				photoToEdit={photoToEdit}
			/>
		</Dialog>
	);
}

PhotoDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	images: PropTypes.arrayOf(PropTypes.shape({
		image_id: PropTypes.number.isRequired,
		image_photo: PropTypes.string.isRequired
	})).isRequired,
	refreshGallery: PropTypes.func.isRequired,
};

export default PhotoDialog;

