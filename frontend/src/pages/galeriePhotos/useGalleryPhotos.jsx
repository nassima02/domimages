import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useGalleryPhotos(categoryId) {
	const [category, setCategory] = useState({});
	const [photos, setPhotos] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const fetchGallery = () => {
		axios.get(`${apiUrl}/categories/${categoryId}/photos`)
			.then(response => {
				if (response.data.length > 0) {
					setCategory(response.data[0]); // Assurez-vous que vous recevez les détails de la catégorie ici
					setPhotos(response.data.filter(photo => photo.photo_image));
				} else {
					setCategory({});
					setPhotos([]);
				}
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
			});
	};

	useEffect(() => {
		if (categoryId) {
			fetchGallery();
		}
	}, [categoryId]);

	return [category, fetchGallery, photos];
}