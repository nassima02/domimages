import {useState, useEffect} from 'react';
import axios from 'axios';

const useGallery = (projetId) => {
	const [projet, setProjet] = useState(null);
	const [images, setImages] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const fetchGallery = () => {
		axios.get(`${apiUrl}/projets/${projetId}/images`)
			.then(response => {
				if (response.data && response.data.length > 0) {
					// Filtrer les images sans `image_photo`
					const validImages = response.data.filter(image => image.image_photo);

					const images = validImages.map(image => ({
						...image,
						photo_image: `${apiUrl}/thumbnails/${image.image_photo}`,
					}));

					setProjet(response.data[0]); // response.data[0] est maintenant sûr d'exister
					setImages(images); // Met à jour avec seulement les images valides
				} else {
					setProjet(null); // Mets projet à null si pas de données
					setImages([]);    // Vide la liste d'images
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
};

export default useGallery;

