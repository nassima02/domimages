import {useEffect, useState} from "react";
import axios from "axios";

export default function useProjets() {
	const [projets, setProjets] = useState([]);
	const [loading, setLoading] = useState(true); // État de chargement
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const fetchProjets = () => {
		setLoading(true); // Commencez le chargement
		axios.get(`${apiUrl}/projets`)
			.then(response => {
				setProjets(response.data);
				setLoading(false); // Fin du chargement
			})
			.catch(error => {
				console.error('Il y a eu une erreur!', error);
				setLoading(false); // Fin du chargement même en cas d'erreur
			});
	};

	useEffect(() => {
		fetchProjets();
	}, []);

	return [projets, fetchProjets, loading]
}
