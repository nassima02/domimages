
import { useEffect, useState } from "react";
import axios from "axios";

export default function useCategories() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true); // État de chargement
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const fetchCategories = () => {
		setLoading(true); // Commencez le chargement
		axios.get(`${apiUrl}/categories`)
			.then(response => {
				setCategories(response.data);
				setLoading(false); // Fin du chargement
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
				setLoading(false); // Fin du chargement même en cas d'erreur
			});
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return [categories, fetchCategories, loading]; // Ajoutez loading à ce qui est renvoyé
}



// import {useEffect, useState} from "react";
// import axios from "axios";
//
// export default function useCategories() {
// 	const [categories, setCategories] = useState([]);
// 	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite
//
// 	const fetchCategories = () => {
// 		axios.get(`${apiUrl}/categories`)
// 			.then(response => {
// 				setCategories(response.data);
// 			})
// 			.catch(error => {
// 				console.error('Il y a eu une erreur!', error);
// 			});
// 	};
//
// 	useEffect(() => {
// 		fetchCategories();
// 	}, []);
//
// 	return [categories, fetchCategories]
// }

