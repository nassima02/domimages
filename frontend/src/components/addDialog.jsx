import PropTypes from "prop-types";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Buttons from "./buttons.jsx";

export default function AddDialog({ open, onClose, titles, fields, imagePreview, onFieldChange, onImageChange, onSubmit, showDescription }) {
	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="draggable-dialog-title">
			<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
				{titles}
			</DialogTitle>
			<DialogContent>
				{fields.map((field, index) => (
					<TextField
						key={index}
						autoFocus={index === 0}
						margin="dense"
						label={field.label}
						type={field.type}
						fullWidth
						value={field.value}
						onChange={(e) => onFieldChange(index, e.target.value)}
						multiline={field.multiline}
						rows={field.rows || 1}
					/>
				))}
				<input
					accept="image/*"
					style={{ display: 'none' }}
					id="raised-button-file"
					type="file"
					onChange={onImageChange}
				/>
				<label htmlFor="raised-button-file">
					{imagePreview ? (
						<div style={{ marginTop: '10px' }}>
							<img src={imagePreview} alt="Prévisualisation" style={{ width: '100%', height: 'auto' }} />
						</div>
					) : (
						<div style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							cursor: 'pointer',
							padding: '10px',
							border: '2px dashed #ccc',
							borderRadius: '10px',
							marginTop: '10px',
							textAlign: 'center',
						}}>
							<img src="/images/telecharger-image.png" alt="Ajouter une photo" style={{ width: '50px', height: '50px', marginBottom: '10px' }} />
							<Typography variant="body1" style={{ color: '#555' }}>+ Ajouter photo</Typography>
							<Typography variant="caption" style={{ color: '#999' }}>jpg, png : 4mo max</Typography>
						</div>
					)}
				</label>
			</DialogContent>
			<DialogActions sx={{ display: 'flex', justifyContent: 'center!important' }}>
				<Buttons text="Annuler" onClick={onClose} />
				<Buttons text="Valider" onClick={onSubmit} />
			</DialogActions>
		</Dialog>
	);
}

AddDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	titles: PropTypes.string.isRequired,
	fields: PropTypes.array.isRequired,
	imagePreview: PropTypes.string,
	onFieldChange: PropTypes.func.isRequired,
	onImageChange: PropTypes.func.isRequired,
	onSubmit: PropTypes.func.isRequired,
	showDescription: PropTypes.bool.isRequired,
};