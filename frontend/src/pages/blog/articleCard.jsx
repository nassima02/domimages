import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useContext } from 'react';
import { AuthContext } from '../../AuthContext.jsx';
import {Divider} from "@mui/material";

export default function ArticleCard({ article, handleUpdateArticle, handleDeleteArticle }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { user } = useContext(AuthContext);
	const open = Boolean(anchorEl);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const formattedDate = formatDistanceToNow(new Date(article.created_at), {
		addSuffix: true,
		locale: fr,
	});

	return (
		<Card
			sx={{
				maxWidth: '100%',
				margin: 'auto',
				boxShadow: '0px 4px 10px #16202E',
				display: 'flex',
				flexDirection: {
					xs: 'column', // Affichage en colonne pour les petits écrans
					md: 'row',    // Affichage en ligne pour les écrans moyens et plus
				},
				alignItems: 'flex-start',
				height: 'auto', // Hauteur automatique pour s'adapter au contenu
			}}
		>
			<CardMedia
				component="img"
				src={`${apiUrl}${article.image}`}
				alt={article.title}
				sx={{
					objectFit: 'fill',
					maxWidth: {
						xs: '100%', // Prend toute la largeur sur mobile
						md: '30%',  // Prend 35% de la largeur sur les écrans moyens et plus
					},
					height: {
						xs: '50%', // Hauteur de l'image sur mobile
						md: '100%',
					},
					alignSelf: 'flex-start', // Assure que l'image est alignée au début du contenu
				}}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', width: '90%', padding: 16 }}>
				<CardHeader
					action={user && user.isAdmin && (
						<>
							<IconButton aria-label="settings" onClick={handleClick} sx={{ color: 'var(--primary-main)', marginLeft: 4 }}>
								<MoreVertIcon />
							</IconButton>
							<Menu
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								PaperProps={{
									style: {
										width: '100px',
									},
								}}
							>
								<MenuItem
									onClick={() => { handleUpdateArticle(article); handleClose(); }}
									style={{ fontSize: '13px' }} // Taille de la police réduite
								>
									Modifier
								</MenuItem>
								<MenuItem
									onClick={() => { handleDeleteArticle(article.article_id); handleClose(); }}
									style={{ fontSize: '13px' }} // Taille de la police réduite
								>
									Supprimer
								</MenuItem>
							</Menu>

						</>
					)}
					title={article.title}
					subheader={`Publié ${formattedDate}`}
					sx={{
						'& .MuiCardHeader-subheader': {
							fontSize: '0.8rem',
							color: 'var(--primary-light)',
							m: 1.5,
							ml:0
						},
						'& .MuiCardHeader-title': {
							fontSize: {
								xs: '1rem',
								md: '1.5rem',
							},
						},
						color: 'var(--primary-main)',
						padding: 0,
					}}
				/>
				<Divider/>
				<CardContent sx={{ padding: '8px 0' }}>
					<Typography paragraph sx={{ fontSize: '0.9rem' }}>
						{article.description}
						{article.url && (
							<>
								<br />
								<a href={article.url} target="_blank" rel="noopener noreferrer">
									{article.url}
								</a>
							</>
						)}
					</Typography>
				</CardContent>
			</div>
		</Card>
	);
}

ArticleCard.propTypes = {
	article: PropTypes.object.isRequired,
	handleUpdateArticle: PropTypes.func.isRequired,
	handleDeleteArticle: PropTypes.func.isRequired,
};