import PropTypes from 'prop-types';
import axios from 'axios';
import {useState, useEffect} from 'react';
import {Dialog, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import DialogActions from "@mui/material/DialogActions";
import Buttons from "../../components/buttons.jsx";

export default function UpdatePhotoProjetDialog({open, onClose, title, refreshGallery, photoToEdit}) {
	const [photoTitle, setPhotoTitle] = useState('');
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	useEffect(() => {
		if (photoToEdit) {
			setPhotoTitle(photoToEdit.image_title);
			setPreview(`${apiUrl}/thumbnails/${photoToEdit.image_photo}`); // Utilisez la miniature si disponible
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

	const handleSubmit = () => {
		if (!image && !photoToEdit) {
			console.error('Aucune image sélectionnée.');
			return;
		}

		const formData = new FormData();
		if (image) {
			formData.append('image', image);
		}
		const projetId = window.location.pathname.split('/').pop();
		formData.append('projetId', projetId);
		formData.append('title', photoTitle);

		const url = photoToEdit ? `${apiUrl}/images/${photoToEdit.image_id}` : `${apiUrl}/images`;
		const method = photoToEdit ? 'put' : 'post';
		const expectedSuccessMessage = photoToEdit ? 'Projet modifié avec succès' : 'Photo ajoutée avec succès';

		axios({method, url, data: formData, headers: {'Content-Type': 'multipart/form-data'}})
			.then(res => {
				if (res.data.message === expectedSuccessMessage) {
					resetForm();
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
		resetForm();
		onClose();
	};

	const resetForm = () => {
		setPhotoTitle('');
		setImage(null);
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
								<img src={`${apiUrl}/thumbnails/${photoToEdit.image_photo}`}
								     alt="Image actuelle" // Vérifie ici aussi
								     style={{width: '100%', height: 'auto'}}/>
							)
						)}

						<Typography variant="body1"
						            style={{color: '#555'}}>{preview ? '+ Modifier photo' : '+ Ajouter photo'}</Typography>
						<Typography variant="caption" style={{color: '#999'}}>jpg, png : 4mo max</Typography>
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

UpdatePhotoProjetDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	refreshGallery: PropTypes.func.isRequired,
	photoToEdit: PropTypes.object,
};


