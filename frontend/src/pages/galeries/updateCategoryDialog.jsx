import { useState, useEffect } from 'react';
import axios from "axios";
import PropTypes from "prop-types";
import AddDialog from "../../components/addDialog.jsx";

export default function UpdateCategoryDialog({ open, onClose, titles, showDescription, refreshCategories, categoryToEdit }) {
	const [title, setTitle] = useState('');
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [description, setDescription] = useState('');
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	useEffect(() => {
		if (categoryToEdit) {
			setTitle(categoryToEdit.category_title);
			setPreview(`${apiUrl}${categoryToEdit.category_image}`);
			setDescription(categoryToEdit.category_description);
		} else {
			resetForm();
		}
	}, [categoryToEdit]);

	const resetForm = () => {
		setTitle('');
		setImage(null);
		setPreview(null);
		setDescription('');
	};

	const handleFieldChange = (index, value) => {
		if (index === 0) setTitle(value);
		if (showDescription && index === 1) setDescription(value);
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		setImage(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setPreview(reader.result);
		};
		if (file) {
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const formData = new FormData();
		formData.append('title', title);
		formData.append('description', description);
		if (image) {
			formData.append('image', image);
		}

		const url = categoryToEdit ? `${apiUrl}/categories/${categoryToEdit.category_id}` : `${apiUrl}/galeries`;
		const method = categoryToEdit ? 'put' : 'post';

		axios({ method, url, data: formData, headers: { 'Content-Type': 'multipart/form-data' } })
			.then(res => {
				console.log('Réponse du serveur:', res.data);
				if (res.data.message === (categoryToEdit ? 'Catégorie modifiée avec succès' : 'Catégorie ajoutée avec succès')) {
					resetForm();
					onClose();
					refreshCategories();
				} else {
					console.error('Erreur lors de l\'ajout/modification de la catégorie:', res.data.error);
				}
			})
			.catch(error => {
				console.error('Erreur Axios:', error);
			});
	};
	const fields = [
		{ label: "Titre", type: "text", value: title }
	];

	if (showDescription) {
		fields.push({ label: "Description", type: "text", value: description, multiline: true, rows: 4 });
	}
	return (
		<AddDialog
			open={open}
			onClose={onClose}
			titles={titles}
			fields={fields}
			imagePreview={preview}
			onFieldChange={handleFieldChange}
			onImageChange={handleImageChange}
			onSubmit={handleSubmit}
			showDescription={showDescription}
		/>
	);

}
UpdateCategoryDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	titles: PropTypes.string.isRequired,
	showDescription: PropTypes.bool.isRequired,
	refreshCategories: PropTypes.func.isRequired,
	categoryToEdit: PropTypes.object,
};
