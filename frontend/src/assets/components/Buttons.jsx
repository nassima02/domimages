import Button from '@mui/material/Button';
import PropTypes from "prop-types";

const Buttons = ({ text, onClick }) => {
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

Buttons.propTypes = {
	text: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired,
};

export default Buttons;