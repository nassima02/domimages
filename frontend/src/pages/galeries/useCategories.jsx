import {useEffect, useState} from "react";
import axios from "axios";

export default function useCategories() {
	const [categories, setCategories] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const fetchCategories = () => {
		axios.get(`${apiUrl}/categories`)
			.then(response => {
				setCategories(response.data);
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
			});
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	return [categories, fetchCategories]
}