import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Box, Typography, IconButton, Tooltip, Grid, DialogTitle } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import ChangeCategoryDialog from "./updateCategoryDialog.jsx";
import Buttons from "../../components/buttons.jsx";

function CategoryDialog({ open, onClose, refreshCategories, categories }) {
	const [openModal, setOpenModal] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [categoryToEdit, setCategoryToEdit] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite

	const handleOpenDialog = () => {
		setShowDescription(true);
		setOpenModal(true);
	};

	const handleCloseDialog = () => {
		setOpenModal(false);
		setCategoryToEdit(null);
	};

	const deleteCategorie = (id) => {
		if (window.confirm("Voulez-vous vraiment supprimer cette catégorie?")) {
			axios.delete(`${apiUrl}/categories/${id}`)
				.then(res => {
					console.log('Catégorie supprimée:', res.data);
					// Rafraîchir les catégories après la suppression
					refreshCategories();
				})
				.catch(error => {
					console.error('Erreur lors de la suppression de la catégorie:', error);
				});
		}
	};

	const onUpdate = (categorie) => {
		setCategoryToEdit(categorie);
		handleOpenDialog();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>Catégories
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: 'absolute',
						right: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent dividers>
				<Box sx={{ paddingTop: 1 }}>
					<Grid container spacing={2} justifyContent="center">
						{categories?.map((categorie) => (
							<Grid key={categorie.category_id} sx={{ p: 1, width: 'auto' }}>
								<Box
									sx={{
										position: 'relative',
										height: 110,
										width: 150,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
										backgroundImage: `url(${apiUrl}${categorie.category_image})`,
										boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										overflow: 'hidden',
									}}
								>
									<Box
										sx={{
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
											color: '#fff',
											width: '100%',
											height: '100%',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											position: 'relative',
											p: 1,
											textAlign: 'center',
										}}
									>
										<Typography component="span" color="inherit">
											{categorie.category_title}
										</Typography>
										<Tooltip title="Supprimer">
											<IconButton
												sx={{ position: 'absolute', top: 8, right: 0 }}
												onClick={() => deleteCategorie(categorie.category_id)}
											>
												<DeleteIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
											</IconButton>
										</Tooltip>
										<Tooltip title="Modifier">
											<IconButton
												sx={{ position: 'absolute', top: 8, right: 40 }}
												onClick={() => onUpdate(categorie)}
											>
												<EditIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
											</IconButton>
										</Tooltip>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
				<Buttons text="Ajouter une catégorie" onClick={handleOpenDialog} />
			</Box>
			<ChangeCategoryDialog
				open={openModal}
				onClose={handleCloseDialog}
				titles={categoryToEdit ? "Modifier la catégorie" : "Ajouter une catégorie"}
				showDescription={showDescription}
				refreshCategories={refreshCategories}
				categoryToEdit={categoryToEdit}
			/>
		</Dialog>
	);
}

CategoryDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	refreshCategories: PropTypes.func.isRequired,
	categories: PropTypes.array,
};

export default CategoryDialog;
