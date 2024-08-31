import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useProjetsPhotos(projetId) {
	const [projet, setProjet] = useState({});
	const [images, setImages] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const fetchGallery = () => {
		axios.get(`${apiUrl}/projets/${projetId}/images`)
			.then(response => {
				if (response.data.length > 0) {
					setProjet(response.data[0]);
					setImages(response.data.filter(image => image.image_photo));
				} else {
					setProjet({});
					setImages([]);
				}
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
			});
	};

	useEffect(() => {
		if (projetId) {
			fetchGallery();
		}
	}, [projetId]);

	return [projet, fetchGallery, images];
}
