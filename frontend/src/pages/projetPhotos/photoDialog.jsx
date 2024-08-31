import PropTypes from "prop-types";
import axios from "axios";
import {useState} from "react";
import {Dialog, DialogContent, DialogTitle, Box, Grid, Tooltip, IconButton} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close.js";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Buttons from "../../components/buttons.jsx";
import UpdatePhotoProjetDialog from "./updatePhotoProjetDialog.jsx";

function PhotoDialog({open, onClose, title, images, refreshGallery}) {

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

	const handleEditPhoto = (image) => {
		setPhotoToEdit(image);
		handleOpenDialog();
	};

	const handleDeletePhoto = (imageId) => {
		console.log('ID de la photo à supprimer:', imageId);
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
						{images?.map((image) => (
							<Grid key={image.image_id} sx={{p: 1, width: 'auto'}}>
								<Box
									sx={{
										position: 'relative',
										height: 110,
										width: 150,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundImage: `url(${apiUrl}${image.image_photo})`,
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
												onClick={() => handleDeletePhoto(image.image_id)}
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
	projet: PropTypes.object,
	images: PropTypes.arrayOf(PropTypes.shape({
		image_id: PropTypes.number.isRequired,
		image_photo: PropTypes.string.isRequired
	})).isRequired,
	refreshGallery: PropTypes.func.isRequired,
};

export default PhotoDialog;