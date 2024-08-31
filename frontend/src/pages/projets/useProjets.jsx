import {useEffect, useState} from "react";
import axios from "axios";

export default function useProjets() {
	const [projets, setProjets] = useState([]);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const fetchProjets = () => {
		axios.get(`${apiUrl}/projets`)
			.then(response => {
				setProjets(response.data);
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
			});
	};

	useEffect(() => {
		fetchProjets();
	}, []);

	return [projets, fetchProjets]
}
