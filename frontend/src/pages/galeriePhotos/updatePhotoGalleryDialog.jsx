import axios from 'axios';
import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Dialog, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import DialogActions from "@mui/material/DialogActions";
import Buttons from "../../components/buttons.jsx";

export default function UpdatePhotoGalleryDialog({open, onClose, title, refreshGallery, photoToEdit}) {
	const [photoTitle, setPhotoTitle] = useState('');
	const [photo, setPhoto] = useState(null);
	const [preview, setPreview] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	useEffect(() => {
		if (photoToEdit) {
			setPhotoTitle(photoToEdit.photo_title);
			setPreview(photoToEdit.photo_image);
		} else {
			resetForm();
		}
	}, [photoToEdit]);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setPhoto(file);
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

	const handleSubmit = () => {
		if (!photo && !photoToEdit) {
			console.error('Aucune image sélectionnée.');
			return;
		}
		const formData = new FormData();
		if (photo) {
			formData.append('image', photo);
		}

		const categoryId = window.location.pathname.split('/').pop();
		formData.append('categoryId', categoryId);
		formData.append('title', photoTitle);

		const url = photoToEdit ? `${apiUrl}/photos/${photoToEdit.photo_id}` : `${apiUrl}/photos`;
		const method = photoToEdit ? 'put' : 'post';

		const expectedSuccessMessage = photoToEdit ? 'Projet modifié avec succès' : 'Photo ajoutée avec succès';

		axios({
			method,
			url,
			data: formData,
			headers: {'Content-Type': 'multipart/form-data'}
		})
			.then(res => {
				console.log('Réponse complète:', res); // Affiche toute la réponse pour debug

				if (res.data.message === expectedSuccessMessage) {
					resetForm(); // Réinitialiser le formulaire après la soumission
					if (onClose) {
						onClose();
					}
					if (refreshGallery) {
						refreshGallery();
					}
				} else {
					console.error('Erreur lors de l\'ajout/modification de la photo:', res.data.error || 'Message d\'erreur non défini');
				}
			})
			.catch(error => {
				console.error('Erreur Axios:', error.response ? error.response.data : error.message);
			});
	};

	const handleClose = () => {
		onClose();
	};

	const resetForm = () => {
		setPhotoTitle('');
		setPhoto(null);
		setPreview(null);
	};

	return (
		<Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
			<DialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
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
					style={{display: 'none'}}
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
							<img src={preview} alt="Prévisualisation" style={{width: '100%', height: 'auto'}}/>
						) : (
							photoToEdit && (
								<img src={`${apiUrl}/thumbnails/${photoToEdit.photo_image}`} alt="Image actuelle"
								     style={{width: '100%', height: 'auto'}}/>
							)
						)}
						<Typography variant="body1"
						            style={{color: '#555'}}>{preview ? '+ Modifier photo' : '+ Ajouter photo'}</Typography>
						<Typography variant="caption" style={{color: '#999'}}>jpg, png : 4mo max</Typography>
						{/*<Typography variant="body1" style={{ color: '#555' }}>+ Ajouter photo</Typography>*/}
						{/*<Typography variant="caption" style={{ color: '#999' }}>jpg, png : 4mo max</Typography>*/}
					</div>
				</label>
			</DialogContent>
			<DialogActions sx={{display: 'flex', justifyContent: 'center!important'}}>
				<Buttons text="Annuler" onClick={handleClose}/>
				<Buttons text={photoToEdit ? "Modifier" : "Ajouter"} onClick={handleSubmit}/>
			</DialogActions>
		</Dialog>
	);
}

UpdatePhotoGalleryDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	refreshGallery: PropTypes.func.isRequired,
	photoToEdit: PropTypes.object,
};
