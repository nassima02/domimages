import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {Box, TextField, Typography} from '@mui/material';
import AddButton from '../../assets/components/buttons.jsx';

const ArticleForm = ({ onSubmit, editingLink, setEditingLink, initialData }) => {
	const [newLink, setNewLink] = useState(initialData);
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);

	useEffect(() => {
		if (editingLink) {
			setNewLink({
				title: editingLink.title,
				url: editingLink.url,
				image: editingLink.image,
				description: editingLink.description,
			});
			setPreview(`http://localhost:5000${editingLink.image}`);
		} else {
			setNewLink(initialData);
			setPreview(null);
		}
	}, [editingLink, initialData]);

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

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit(newLink, image);
		if (editingLink) setEditingLink(null); // Réinitialise l'état d'édition
	};

	const handleReset = () => {
		setNewLink(initialData);
		setImage(null);
		setPreview(null);
		if (editingLink) setEditingLink(null); // Réinitialise l'état d'édition
	};

	// Fonction pour déclencher le champ de fichier caché
	const handleFileInputClick = () => {
		document.getElementById('raised-button-file').click();
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: '40px'}}>
			<Typography variant="h2" component="h2">
				{editingLink ? 'Modifier un article' : 'Ajouter un article'}
			</Typography>

			<TextField
				id="title"
				name="title"
				fullWidth
				label="Titre"
				value={newLink.title}
				onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
				required
				sx={{ mb: 2, background: "#fff" }}
				InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
				placeholder="Titre"
			/>
			<TextField
				id="url"
				name="url"
				fullWidth
				label="URL"
				value={newLink.url}
				onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
				sx={{ mb: 2, background: "#fff" }}
				InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
				placeholder="URL"
			/>
			<input
				accept="image/*"
				style={{ display: 'none' }}
				id="raised-button-file"
				type="file"
				onChange={handleImageChange}
			/>
			<label htmlFor="raised-button-file" style={{ display: 'flex', margin: '2px' }}>
				<AddButton
					text="Image"
					onClick={handleFileInputClick}
					component="span"
				/>
			</label>
			{preview && <img src={preview} alt="Prévisualisation" style={{ maxWidth: '300px', marginTop: '10px' }} />}
			<TextField
				id="description"
				name="description"
				fullWidth
				label="Description"
				multiline
				rows={4}
				value={newLink.description}
				onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
				sx={{ mt: 2, mb: 2, background: "#fff" }}
				InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
				placeholder="Description"
			/>
			<Box sx={{display:'flex', gap:2}}>
				<AddButton text={editingLink ? "Modifier" : "Ajouter"} onClick={handleSubmit} />
				<AddButton text="Annuler" onClick={handleReset}  />
			</Box>
		</form>
	);
};

ArticleForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	editingLink: PropTypes.object,
	setEditingLink: PropTypes.func.isRequired,
	initialData: PropTypes.object.isRequired,
};

ArticleForm.defaultProps = {
	editingLink: null,
};

export default ArticleForm;