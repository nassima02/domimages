import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, TextField, Button } from '@mui/material';

const AvisForm = ({ onSubmit, onCancel }) => {
	const [name, setName] = useState('');
	const [comment, setComment] = useState('');
	const [isDisabled, setIsDisabled] = useState(true);

	useEffect(() => {
		setIsDisabled(!name || !comment);
	}, [name, comment]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (onSubmit) {
			onSubmit({ name, comment });
			setName('');
			setComment('');
		}
	};

	const handleCancel = () => {
		if (onCancel) {
			onCancel();
		}
		setName('');
		setComment('');
	};

	return (
		<Box sx={{ pt: 2, pb: 2 }}>
			<form onSubmit={handleSubmit}>
				<TextField
					id="name"
					name="name"
					fullWidth
					label="Nom (ou pseudo)"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
					sx={{ mb: 2, background: "#fff" }}
					InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
				/>
				<TextField
					id="comment"
					name="comment"
					fullWidth
					label="Commentaire"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					required
					multiline
					rows={4}
					sx={{ mb: 2, background: "#fff" }}
					InputLabelProps={{ style: { color: 'var(--primary-main)' } }}
				/>
				<Box sx={{ display: 'flex', gap: 1 }}>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isDisabled}
						sx={{ backgroundColor: 'var(--secondary-main)',color: 'var(--primary-main)', fontWeight:'bold', '&:disabled': { backgroundColor: 'var(--primary-main)', color: 'var(--secondary-main)' }, '&:hover': { backgroundColor: 'var(--secondary-main)' } }}
					>
						Envoyer
					</Button>
					<Button
						type="button"
						variant="outlined"
						color="secondary"
						onClick={handleCancel}
						sx={{ backgroundColor: 'var(--primary-main)', color: 'var(--secondary-main)',fontWeight:'bold', '&:hover': { backgroundColor: 'var(--secondary-main)', color: 'var(--primary-main)', fontWeight:'bold'} }}
					>
						Annuler
					</Button>
				</Box>
			</form>
		</Box>
	);
};

AvisForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func,
};

export default AvisForm;