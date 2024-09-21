import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import ButtonBase from "@mui/material/ButtonBase";
import { Typography } from "@mui/material";

// Style pour le bouton de l'image
const ImageButton = styled(ButtonBase)(({ theme }) => ({
	position: 'relative',
	height: 250,
	width: '45%', // Valeur par défaut pour les écrans moyens et grands
	margin: theme.spacing(2),
	boxShadow: '0px 4px 30px rgba(0, 0, 0, 1)',
	[theme.breakpoints.down('sm')]: {
		width: '100% !important',
		height: 150,
	},
	[theme.breakpoints.up('md')]: {
		width: '45%',
		height: 300,
	},
	[theme.breakpoints.up('lg')]: {
		width: '30%', // Définir le nombre de cartes par ligne dans les galeries
		height: 350,
	},
	'&:hover, &.Mui-focusVisible': {
		zIndex: 1,
		'& .MuiImageBackdrop-root': {
			opacity: 0.1,
		},
		'& .MuiImageMarked-root': {
			opacity: 0,
		},
		'& .MuiTypography-root': {
			border: '4px solid currentColor',
		},
	},
}));

// Style pour l'image dans la carte
const ImageSrc = styled('img')({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	width: '100%',
	height: '100%',
	objectFit: 'cover', // Ajuste l'image pour couvrir tout le conteneur
	objectPosition: 'center 15%', // Centre l'image
});

const Image = styled('span')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: theme.palette.common.white,
}));

const ImageBackdrop = styled('span')(({ theme }) => ({
	position: 'absolute',
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	backgroundColor: theme.palette.common.black,
	opacity: 0.5,
	transition: theme.transitions.create('opacity'),
}));

const ImageMarked = styled('span')(({ theme }) => ({
	height: 3,
	width: 18,
	backgroundColor: theme.palette.common.white,
	position: 'absolute',
	bottom: -2,
	left: 'calc(50% - 9px)',
	transition: theme.transitions.create('opacity'),
}));

export default function Card({ id, image, title, onClick }) {

	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	return (
		<ImageButton
			focusRipple
			key={id}
			onClick={() => onClick(id)}
		>
			<ImageSrc src={`${apiUrl}${image}`} alt={title} />
			<ImageBackdrop className="MuiImageBackdrop-root" />
			<Image>
				<Typography
					component="span"
					variant="h1"
					color="inherit"
					sx={{
						position: 'relative',
						p: 4,
					}}
				>
					{title}
					<ImageMarked className="MuiImageMarked-root" />
				</Typography>
			</Image>
		</ImageButton>
	);
}

Card.propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};
