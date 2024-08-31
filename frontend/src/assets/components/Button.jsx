import Button from '@mui/material/Button';
import PropTypes from "prop-types";

const AddButton = ({ text, onClick }) => {
	return (
		<Button
			variant="contained"
			onClick={onClick}
			sx={{
				width: {
					xs: '100%',
					sm: '150px',
					md: '200px',
					lg: '250px',
				},
				color: 'var(--primary-contrastText)',
				background: 'var(--primary-main)',
				//mr: {sx:0, lg:'1rem'},
				fontWeight:'bold',
				'&:hover': {
					background: 'var(--secondary-main)',
					color: 'var(--primary-main)',
				},
			}}
		>
			{text}
		</Button>
	);
};

AddButton.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default AddButton;