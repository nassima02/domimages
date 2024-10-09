import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography } from '@mui/material';
import { AuthContext } from "../../AuthContext.jsx";
import ArticleForm from "./articleForm.jsx";
import ArticleCard from "./articleCard.jsx";

const BlogPage = () => {
	const [articles, setArticles] = useState([]);
	const [editingArticle, setEditingArticle] = useState(null);
	const { user } = useContext(AuthContext);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const initialData = { title: '', url: '', image: '', description: '' };

	useEffect(() => {
		fetchArticles();
	}, []);

	const fetchArticles = async () => {
		try {
			const response = await axios.get(`${apiUrl}/articles`);
			setArticles(response.data);
		} catch (err) {
			console.error('Erreur lors de la récupération des articles:', err);
		}
	};

	const handleAddOrUpdateArticle = async (articleData, image) => {
		try {
			const formData = new FormData();
			formData.append('title', articleData.title);
			formData.append('url', articleData.url);
			formData.append('image', image);
			formData.append('description', articleData.description);

			if (editingArticle) {
				await axios.put(`${apiUrl}/articles/${editingArticle.article_id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
				setEditingArticle(null);
			} else {
				await axios.post(`${apiUrl}/articles`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				});
			}

			fetchArticles();
		} catch (err) {
			console.error("Erreur lors de l'ajout ou de la mise à jour de l'article:", err);
		}
	};

	const handleDeleteArticle = async (articleId) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
			try {
				await axios.delete(`${apiUrl}/articles/${articleId}`);
				fetchArticles();
			} catch (err) {
				console.error("Erreur lors de la suppression de l'article:", err);
			}
		}
	};

	const handleUpdateArticle = (article) => {
		setEditingArticle(article);
	};

	return (
		<Box sx={{ width: { md: '60%', xs: '100%' }, maxWidth: '1280px', paddingTop: 2, paddingBottom: 2, m: { xs: 0, sm: 1, md: 2 } }}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
				<Typography variant="h1" component="h1">
					BLOG
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					width: {
						xs: '100%',
						sm: '90%',
						md: '70%',
						lg: '60%',
					},
					margin: '0 auto',
				}}
			>
				<Typography variant="body1" component="p" sx={{ mb: '30px' }}>
					Découvrez mes avis, mes partages d&apos;événements, d&apos;expositions et de liens, principalement autour de la photographie.
				</Typography>
			</Box>

			{user && user.isAdmin && (
				<ArticleForm
					onSubmit={handleAddOrUpdateArticle}
					editingLink={editingArticle}
					setEditingLink={setEditingArticle}
					initialData={initialData}
				/>
			)}

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2 }}>
				{articles.map((article) => (
					<Box
						key={article.article_id}
						sx={{
							width: { xs: '100%', sm: '48%' }, // 48% pour laisser de l'espace entre les cartes
							mb: 4,
						}}
					>
						<ArticleCard
							article={article}
							handleUpdateArticle={handleUpdateArticle}
							handleDeleteArticle={handleDeleteArticle}
						/>
					</Box>
				))}
			</Box>
		</Box>
	);
};

export default BlogPage;



// import {useState, useEffect, useContext} from 'react';
// import axios from 'axios';
// import {Box, Typography} from '@mui/material';
// import {AuthContext} from "../../AuthContext.jsx";
// import ArticleForm from "./articleForm.jsx";
// import ArticleCard from "./articleCard.jsx";
//
// const BlogPage = () => {
// 	const [articles, setArticles] = useState([]);
// 	const [editingArticle, setEditingArticle] = useState(null);
// 	const { user } = useContext(AuthContext);
// 	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite
//
// 	const initialData = { title: '', url: '', image: '', description: '' };
//
// 	useEffect(() => {
// 		fetchArticles();
// 	}, []);
//
// 	const fetchArticles = async () => {
// 		try {
// 			const response = await axios.get(`${apiUrl}/articles`);
// 			setArticles(response.data);
// 		} catch (err) {
// 			console.error('Erreur lors de la récupération des articles:', err);
// 		}
// 	};
//
// 	const handleAddOrUpdateArticle = async (articleData, image) => {
// 		try {
// 			const formData = new FormData();
// 			formData.append('title', articleData.title);
// 			formData.append('url', articleData.url);
// 			formData.append('image', image);
// 			formData.append('description', articleData.description);
//
// 			if (editingArticle) {
// 				await axios.put(`${apiUrl}/articles/${editingArticle.article_id}`, formData, {
// 					headers: {
// 						'Content-Type': 'multipart/form-data',
// 					},
// 				});
// 				setEditingArticle(null);
// 			} else {
// 				await axios.post(`${apiUrl}/articles`, formData, {
// 					headers: {
// 						'Content-Type': 'multipart/form-data',
// 					},
// 				});
// 			}
//
// 			fetchArticles();
// 		} catch (err) {
// 			console.error('Erreur lors de l\'ajout ou de la mise à jour de l\'article:', err);
// 		}
// 	};
//
// 	const handleDeleteArticle = async (articleId) => {
// 		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
// 			try {
// 				await axios.delete(`${apiUrl}/articles/${articleId}`);
// 				fetchArticles();
// 			} catch (err) {
// 				console.error('Erreur lors de la suppression de l\'article:', err);
// 			}
// 		}
// 	};
//
// 	const handleUpdateArticle = (article) => {
// 		setEditingArticle(article);
// 	};
// 	return (
// 		<Box sx={{ width:{md:'60%', xs:'100%'}, maxWidth: '1280px', paddingTop: 2, paddingBottom: 2, m: { xs: 0, sm: 1, md: 2  }}}>
// 			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
// 				<Typography variant="h1" component="h1" >
// 					BLOG
// 				</Typography>
// 			</Box>
// 			<Box
// 				sx={{
// 					display: 'flex',
// 					justifyContent: 'center',
// 					alignItems: 'center',
// 					textAlign: 'center',
// 					width: {
// 						xs: '100%',
// 						sm: '90%',
// 						md: '70%',
// 						lg: '60%'
// 					},
// 					margin: '0 auto',
// 				}}
// 			>
// 				<Typography variant="body1" component="p" sx={{ mb: '30px' }}>
// 					Découvrez mes avis, mes partages d&apos;événements, d&apos;expositions et de liens, principalement autour de la photographie.
// 				</Typography>
// 			</Box>
//
// 			{user && user.isAdmin && (
// 				<ArticleForm
// 					onSubmit={handleAddOrUpdateArticle}
// 					editingLink={editingArticle}
// 					setEditingLink={setEditingArticle}
// 					initialData={initialData}
// 				/>
// 			)}
// 			<Box sx={{ p: 2 }}>
// 				{articles.map((article) => (
// 					<Box
// 						key={article.article_id}
// 						sx={{
// 							width: '100%',
// 							mb: 4,
// 						}}
// 					>
// 						<ArticleCard
// 							article={article}
// 							handleUpdateArticle={handleUpdateArticle}
// 							handleDeleteArticle={handleDeleteArticle}
// 						/>
// 					</Box>
// 				))}
// 			</Box>
// 		</Box>
// 	);
// };
//
// export default BlogPage;