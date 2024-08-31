import axios from "axios";
import {useState} from "react";
import PropTypes from "prop-types";
import {Dialog, DialogContent, DialogTitle, Box, Grid, Tooltip, IconButton} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close.js";
import Buttons from "../../components/buttons.jsx";
import ChangePhotoDialog from "./updatePhotoGalleryDialog.jsx";

function GalleryDialog({open, onClose, title, photos, refreshGallery}) {

	const [openModal, setOpenModal] = useState(false);
	const [photoToEdit, setPhotoToEdit] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const handleOpenDialog = () => {
		setOpenModal(true);
	};

	const handleCloseDialog = () => {
		setOpenModal(false);
		setPhotoToEdit(null);
	};

	const handleEditPhoto = (photo) => {
		setPhotoToEdit(photo);
		handleOpenDialog();
	};

	const handleDeletePhoto = (photoId) => {

		if (window.confirm("Voulez-vous vraiment supprimer cette photo?")) {
			axios.delete(`${apiUrl}/photos/${photoId}`)
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
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md" >
			<DialogTitle>{title}
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
					<CloseIcon />
				</IconButton></DialogTitle>
			<DialogContent dividers>
				<Box sx={{paddingTop: 1}}>
					<Grid container spacing={2} justifyContent="center">
						{photos?.map((image) => (
							<Grid key={image.photo_id} sx={{p: 1, width: 'auto'}}>
								<Box
									sx={{
										position: 'relative',
										height: 110,
										width: 150,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundImage: `url(${apiUrl}${image.photo_image})`,
										boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										overflow: 'hidden',
									}}
								>
									<Box
										sx={{
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
											color: '#fff',
											width: '100%',
											height: '100%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											position: 'relative',
											p: 1,
											textAlign: 'center',
										}}
									>
										<Tooltip title="Supprimer">
											<IconButton
												sx={{position: 'absolute', top: 8, right: 0}}
												onClick={() => handleDeletePhoto(image.photo_id)}
											>
												<DeleteIcon sx={{color: 'white', fontSize: '1.2rem'}}/>
											</IconButton>
										</Tooltip>
										<Tooltip title="Modifier">
											<IconButton
												sx={{position: 'absolute', top: 8, right: 40}}
												onClick={() => handleEditPhoto(image)}
											>
												<EditIcon sx={{color: 'white', fontSize: '1.2rem'}}/>
											</IconButton>
										</Tooltip>
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
			<ChangePhotoDialog
				open={openModal}
				onClose={handleCloseDialog}
				title={photoToEdit ? "Modifier la photo" : "Ajouter une photo"}
				refreshGallery={refreshGallery}
				photoToEdit={photoToEdit}
			/>
		</Dialog>
	);
}

GalleryDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	category: PropTypes.object,
	photos: PropTypes.arrayOf(PropTypes.shape({
		photo_id: PropTypes.number.isRequired,
		photo_image: PropTypes.string.isRequired
	})).isRequired,
	refreshGallery: PropTypes.func.isRequired,
};

export default GalleryDialog;
