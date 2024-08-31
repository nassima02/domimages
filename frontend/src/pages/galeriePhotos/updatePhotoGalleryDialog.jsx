import axios from 'axios';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import DialogActions from "@mui/material/DialogActions";
import Buttons from "../../components/buttons.jsx";

export default function UpdateGalleryPhotoDialog({ open, onClose, title, refreshGallery, photoToEdit }) {
	const [photoTitle, setPhotoTitle] = useState('');
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	useEffect(() => {
		if (photoToEdit) {
			setPhotoTitle(photoToEdit.photo_title);
			setPreview(`${apiUrl}${photoToEdit.photo_image}`);
		} else {
			resetForm();
		}
	}, [photoToEdit]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const handleTitleChange = (e) => {
		setPhotoTitle(e.target.value);
	};

	const handleSubmit = (file, title) => {
		const formData = new FormData();
		formData.append('image', file);
		// Récupérer categoryId à partir de l'URL et l'ajouter au formData
		const categoryId = window.location.pathname.split('/').pop();
		formData.append('categoryId', categoryId);
		formData.append('title', title);

		const url = photoToEdit ? `${apiUrl}/photos/${photoToEdit.photo_id}` : `${apiUrl}/photos`;
		const method = photoToEdit ? 'put' : 'post';

		axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
			.then(res => {
				console.log('Réponse du serveur:', res.data);
				if (res.data.message === (photoToEdit ? 'Photo modifiée avec succès' : 'Photo ajoutée avec succès')) {
					resetForm();// Réinitialiser le formulaire après la soumission
					onClose();
					refreshGallery(); // Actualiser la liste des catégories
				} else {
					console.error('Erreur lors de l\'ajout/modification de la photo:', res.data.error);
				}
			})
			.catch(error => {
				console.error('Erreur Axios:', error);
			});
	};

	const handleClose = () => {
		resetForm();
		onClose();
		refreshGallery();
	};

	const resetForm = () => {
		setPhotoTitle('');
		setImage(null);
		setPreview(null);
	};

	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
			<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
				{title}
			</DialogTitle>
			<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					label="Titre"
					type="text"
					fullWidth
					value={photoTitle}
					onChange={handleTitleChange}
				/>
				<input
					accept="image/*"
					style={{ display: 'none' }}
					id="raised-button-file"
					type="file"
					onChange={handleImageChange}
				/>
				<label htmlFor="raised-button-file">
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						cursor: 'pointer',
						padding: '10px',
						border: '2px dashed #ccc',
						borderRadius: '10px',
						marginTop: '10px',
						textAlign: 'center',
					}}>
						{preview ? (
							<img src={preview} alt="Prévisualisation" style={{ width: '100%', height: 'auto' }} />
						) : (
							<>
								<img src="/images/telecharger-image.png" alt="Ajouter une photo" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
								<Typography variant="body1" style={{ color: '#555' }}>+ Ajouter photo</Typography>
								<Typography variant="caption" style={{ color: '#999' }}>jpg, png : 4mo max</Typography>
							</>
						)}
					</div>
				</label>
			</DialogContent>
			<DialogActions sx={{ display: 'flex', justifyContent: 'center!important' }}>
				<Buttons text="Annuler" onClick={handleClose} />
				<Buttons text={photoToEdit ? "Modifier" : "Ajouter"} onClick={() => handleSubmit(image, photoTitle)} />
			</DialogActions>
		</Dialog>
	);
}

UpdateGalleryPhotoDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	refreshGallery: PropTypes.func.isRequired,
	photoToEdit: PropTypes.object,
};