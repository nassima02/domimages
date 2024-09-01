import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Card from "../../components/card.jsx";

export default function ProjetCards({ projets, onProjetClick }) {

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', minWidth: 300, width: '100%', pt: 2, pb: 2  }}>
			{projets.map((projet) => (
				<Card key={projet.projet_id} id={projet.projet_id} title={projet.projet_title} image={projet.projet_image} onClick={onProjetClick}/>
			))}
		</Box>
	);
}

ProjetCards.propTypes = {
	projets: PropTypes.arrayOf(PropTypes.shape({
		projet_id: PropTypes.number.isRequired,
		projet_title: PropTypes.string.isRequired,
		projet_image: PropTypes.string.isRequired,
		projet_description: PropTypes.string.isRequired,
	})).isRequired,
	onProjetClick: PropTypes.func.isRequired,
};