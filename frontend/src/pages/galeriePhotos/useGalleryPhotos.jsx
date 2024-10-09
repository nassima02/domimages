import { useState, useEffect } from 'react';
import axios from 'axios';

const useGallery = (categoryId) => {
	const [category, setCategory] = useState(null);
	const [photos, setPhotos] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const fetchGallery = () => {
		axios.get(`${apiUrl}/categories/${categoryId}/photos`)
			.then(response => {
				console.log(response.data); // Ajoute ce log
				if (response.data && response.data.length > 0) {
					const validPhotos = response.data.filter(photo => photo.photo_image);
					const photosWithDimensions = validPhotos.map(photo => ({
						...photo,
						photo_image: `${photo.photo_image}`,
						dimensions: { width: photo.width, height: photo.height },
					}));

					setCategory(response.data[0]);
					setPhotos(photosWithDimensions);
				} else {
					setCategory(null);
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
};

export default useGallery;



//
//
// import {useState, useEffect} from 'react';
// import axios from 'axios';
//
// const useGallery = (categoryId) => {
// 	const [category, setCategory] = useState(null);
// 	const [photos, setPhotos] = useState([]);
// 	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite
//
// 	const fetchGallery = () => {
// 		axios.get(`${apiUrl}/categories/${categoryId}/photos`)
// 			.then(response => {
// 				if (response.data && response.data.length > 0) {
// 					// Filtrer les photos sans `photo_image`
// 					const validPhotos = response.data.filter(photo => photo.photo_image);
//
// 					const photos = validPhotos.map(photo => ({
// 						...photo,
// 						photo_image: `${photo.photo_image}`, // Conserve le lien de l'image valide
// 					}));
//
// 					setCategory(response.data[0]); // Mise à jour avec la première catégorie
// 					setPhotos(photos); // Met à jour avec seulement les photos valides
// 				} else {
// 					setCategory(null); // Mets la catégorie à null si pas de données
// 					setPhotos([]);    // Vide la liste des photos
// 				}
// 			})
// 			.catch(error => {
// 				console.error('Il y a eu une erreur!', error);
// 			});
// 	};
//
// 	useEffect(() => {
// 		if (categoryId) {
// 			fetchGallery();
// 		}
// 	}, [categoryId]);
//
// 	return [category, fetchGallery, photos];
// };
//
// export default useGallery;
//
//
