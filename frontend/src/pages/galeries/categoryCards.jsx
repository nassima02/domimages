import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Card from "../../components/card.jsx";

export default function CategoryCards({ categories, onCategoryClick }) {

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', minWidth: 300, width: '100%', paddingTop: 2 }}>
			{categories.map((categorie) => (
				<Card key={categorie.category_id} id={categorie.category_id} title={categorie.category_title} image={categorie.category_image} onClick={onCategoryClick}/>
			))}
		</Box>
	);
}

CategoryCards.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.shape({
		category_id: PropTypes.number.isRequired,
		category_title: PropTypes.string.isRequired,
		category_image: PropTypes.string.isRequired,
		category_description: PropTypes.string.isRequired,
	})).isRequired,
	onCategoryClick: PropTypes.func.isRequired,
};