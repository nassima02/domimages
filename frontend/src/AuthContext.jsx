import  { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	// Utilisation des variables d'environnement avec Vite
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		const fetchUser = async () => {
			const userEmail = localStorage.getItem('userEmail');
			if (userEmail) {
				try {
					const response = await axios.get(`${apiUrl}/user/${userEmail}`);
					setUser(response.data);
				} catch (error) {
					console.error('Erreur lors de la récupération de l\'utilisateur:', error);
				}
			}
		};

		fetchUser();
	}, []);

	const updateUser = async (email) => {
		try {
			const response = await axios.get(`${apiUrl}/user/${email}`);
			setUser(response.data);
		} catch (error) {
			console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('userEmail');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, updateUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
