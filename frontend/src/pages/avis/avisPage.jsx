import { useState, useEffect } from 'react';
import { Box, Container, Divider, Typography } from '@mui/material';
import AvisForm from './avisForm';
import AvisList from './avisList';

const AvisPage = () => {
	const [avis, setAvis] = useState([]);
	const [error, setError] = useState(null);

// Utilisation des variables d'environnement avec Vite
	const apiUrl = import.meta.env.VITE_API_URL;

	useEffect(() => {
		fetch(`${apiUrl}/avis`)
			.then(response => {
				if (!response.ok) {
					throw new Error(`Network response was not ok. Status: ${response.status}`);
				}
				return response.json();
			})
			.then(data => setAvis(data))
			.catch(error => {
				console.error('Error fetching avis:', error);
				setError('Failed to load reviews.');
			});
	}, []);

	const handleAddAvis = (newAvis) => {
		fetch(`${apiUrl}/newAvis`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newAvis),
		})
			.then(response => {
				if (!response.ok) {
					return response.text().then(text => {
						throw new Error(`Network response was not ok. Status: ${response.status}, Body: ${text}`);
					});
				}
				return response.json();
			})
			.then(data => setAvis([...avis, data]))
			.catch(error => {
				console.error('Error adding avis:', error);
				setError('Failed to add review.');
			});
	};

	const handleSubmitReply = (reply, commentId) => {
		if (reply) {
			fetch(`${apiUrl}/avis/${commentId}/reply`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ reply }),
			})
				.then(response => {
					if (!response.ok) {
						return response.text().then(text => {
							console.error('Response Text:', text);
							throw new Error(`Network response was not ok. Status: ${response.status}, Body: ${text}`);
						});
					}
					return response.json();
				})
				.then(newReply => {
					console.log('Reply submitted successfully:', newReply);
					setAvis(prevAvis =>
						prevAvis.map(a => {
							if (a.id === commentId) {
								return {
									...a,
									replies: [...(a.replies || []), newReply],
								};
							}
							return a;
						})
					);
				})
				.catch(error => {
					console.error('Error replying to avis:', error);
					setError('Failed to reply to review.');
				});
		}
	};

	const handleDeleteAvis = (id) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
			fetch(`${apiUrl}/avis/${id}`, {
				method: 'DELETE',
			})
				.then(response => {
					if (!response.ok) {
						return response.text().then(text => {
							throw new Error(`Network response was not ok. Status: ${response.status}, Body: ${text}`);
						});
					}
					setAvis(prevAvis => prevAvis.filter(a => a.id !== id));
				})
				.catch(error => {
					console.error('Error deleting avis:', error);
					setError('Failed to delete review.');
				});
		}};

	const handleDeleteReply = (commentId, replyId) => {
		if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
			fetch(`${apiUrl}/avis/${commentId}/reply/${replyId}`, {
				method: 'DELETE',
			})
				.then(response => {
					if (!response.ok) {
						return response.text().then(text => {
							throw new Error(`Network response was not ok. Status: ${response.status}, Body: ${text}`);
						});
					}
					// Mettre à jour l'état local après la suppression de la réponse
					setAvis(prevAvis =>
						prevAvis.map(a => {
							if (a.id === commentId) {
								return {
									...a,
									replies: a.replies.filter(r => r.id !== replyId),
								};
							}
							return a;
						})
					);
				})
				.catch(error => {
					console.error('Error deleting reply:', error);
					setError('Failed to delete reply.');
				});
		}
	};

	return (
		<Container sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, maxWidth: '1280px', pt: 2, m: { xs: 0, sm: 1, md: 2  }}}>
			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flexDirection:'column' }}>
				<Typography variant="h1" component="h1">
					AVIS
				</Typography>
				<Typography variant="body1" component="body1" >
					Votre avis m&apos;intéresse, publiez-le.
				</Typography>
			</Box>

			{error && <Typography color="error">{error}</Typography>}
			<AvisForm onSubmit={handleAddAvis} />
			<Divider
				variant="middle"
				sx={{
					backgroundColor: 'var(--primary-main)',
					boxShadow: '0 2px 2px rgba(154, 137, 104, 1)',
					mb:4,
					mt:2
				}}
			/>
			<Typography variant="h2" component="h2" >
				Avis des visiteurs
			</Typography>
			<AvisList avis={avis} onDelete={handleDeleteAvis} onSubmitReply={handleSubmitReply} onDeleteReply={handleDeleteReply} />

		</Container>
	);
};

export default AvisPage;