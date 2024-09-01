import PropTypes from "prop-types";
import { Box, Typography, IconButton, Tooltip, Grid, DialogTitle } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import axios from "axios";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import CloseIcon from '@mui/icons-material/Close';
import Buttons from "../../components/buttons.jsx";
import UpdateProjetDialog from "./updateProjetDialog.jsx";

function ProjetDialog({ open, onClose, refreshProjets, projets }) {
	const [openModal, setOpenModal] = useState(false);
	const [showDescription, setShowDescription] = useState(false);
	const [projetToEdit, setProjetToEdit] = useState(null);
	const apiUrl = import.meta.env.VITE_API_URL; // Utilisation des variables d'environnement avec Vite

	const handleOpenDialog = () => {
		setShowDescription(true);
		setOpenModal(true);
	};

	const handleCloseDialog = () => {
		setOpenModal(false);
		setProjetToEdit(null);
	};

	const deleteProjet = (id) => {
		if (window.confirm("Voulez-vous vraiment supprimer ce projet?")) {
			axios.delete(`${apiUrl}/projets/${id}`)
				.then(res => {
					console.log('Projet supprimé:', res.data);
					// Rafraîchir les projets après la suppression
					refreshProjets();
				})
				.catch(error => {
					console.error('Erreur lors de la suppression du projet:', error);
				});
		}
	};

	const onUpdate = (projet) => {
		setProjetToEdit(projet);
		handleOpenDialog();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
			<DialogTitle>
				Projets
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
						{projets?.map((projet) => (
							<Grid key={projet.projet_id} item xs={12} sm={6} md={4} lg={3} sx={{ p: 1 }}>
								<Box
									sx={{
										position: 'relative',
										height: 110,
										width: '100%',
										overflow: 'hidden',
										boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
									}}
								>
									<img
										src={`${apiUrl}${projet.projet_image}`}
										alt={`Projet ${projet.projet_id}`}
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											objectPosition: 'center 25%',
										}}
									/>
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backgroundColor: 'rgba(0, 0, 0, 0.5)',
											color: '#fff',
											zIndex: 1,
											p: 1,
											textAlign: 'center',
										}}
									>
										<Typography component="span" color="inherit">
											{projet.projet_title}
										</Typography>
										<Box
											sx={{
												position: 'absolute',
												top: 8,
												right: 8,
												display: 'flex',
												gap: 1,
												zIndex: 2,
											}}
										>
											<Tooltip title="Supprimer">
												<IconButton
													onClick={() => deleteProjet(projet.projet_id)}
												>
													<DeleteIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
												</IconButton>
											</Tooltip>
											<Tooltip title="Modifier">
												<IconButton
													onClick={() => onUpdate(projet)}
												>
													<EditIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
												</IconButton>
											</Tooltip>
										</Box>
									</Box>
								</Box>
							</Grid>
						))}
					</Grid>
				</Box>
			</DialogContent>
			<Box sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
				<Buttons text="Ajouter un projet" onClick={handleOpenDialog} />
			</Box>
			<UpdateProjetDialog
				open={openModal}
				onClose={handleCloseDialog}
				titles={projetToEdit ? "Modifier le projet" : "Ajouter un projet"}
				showDescription={showDescription}
				refreshProjets={refreshProjets}
				projetToEdit={projetToEdit}
			/>
		</Dialog>
	);
}

ProjetDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	refreshProjets: PropTypes.func.isRequired,
	projets: PropTypes.arrayOf(PropTypes.shape({
		projet_id: PropTypes.number.isRequired,
		projet_image: PropTypes.string.isRequired,
		projet_title: PropTypes.string.isRequired,
	})).isRequired,
};

export default ProjetDialog;


// import PropTypes from "prop-types";
// import { Box, Typography, IconButton, Tooltip, Grid, DialogTitle } from '@mui/material';
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useState } from "react";
// import axios from "axios";
// import DialogContent from "@mui/material/DialogContent";
// import Dialog from "@mui/material/Dialog";
// import CloseIcon from '@mui/icons-material/Close';
// import Buttons from "../../components/buttons.jsx";
// import UpdateProjetDialog from "./updateProjetDialog.jsx";
//
// function ProjetDialog({ open, onClose, refreshProjets, projets }) {
// 	const [openModal, setOpenModal] = useState(false);
// 	const [showDescription, setShowDescription] = useState(false);
// 	const [projetToEdit, setProjetToEdit] = useState(null);
// 	const apiUrl = import.meta.env.VITE_API_URL;// Utilisation des variables d'environnement avec Vite
//
// 	const handleOpenDialog = () => {
// 		setShowDescription(true);
// 		setOpenModal(true);
// 	};
//
// 	const handleCloseDialog = () => {
// 		setOpenModal(false);
// 		setProjetToEdit(null);
// 	};
//
// 	const deleteProjet = (id) => {
// 		if (window.confirm("Voulez-vous vraiment supprimer ce projet?")) {
// 			axios.delete(`${apiUrl}/projets/${id}`)
// 				.then(res => {
// 					console.log('Projet supprimée:', res.data);
// 					// Rafraîchir les projets après la suppression
// 					refreshProjets();
// 				})
// 				.catch(error => {
// 					console.error('Erreur lors de la suppression du projet:', error);
// 				});
// 		}
// 	};
//
// 	const onUpdate = (projet) => {
// 		setProjetToEdit(projet);
// 		handleOpenDialog();
// 	};
//
// 	return (
// 		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
// 			<DialogTitle>Projets
// 				<IconButton
// 					aria-label="close"
// 					onClick={onClose}
// 					sx={{
// 						position: 'absolute',
// 						right: 8,
// 						top: 8,
// 						color: (theme) => theme.palette.grey[500],
// 					}}
// 				>
// 					<CloseIcon />
// 				</IconButton>
// 			</DialogTitle>
// 			<DialogContent dividers>
// 				<Box sx={{ paddingTop: 1 }}>
// 					<Grid container spacing={2} justifyContent="center">
// 						{projets?.map((projet) => (
// 							<Grid key={projet.projet_id} sx={{ p: 1, width: 'auto' }}>
// 								<Box
// 									sx={{
// 										position: 'relative',
// 										height: 110,
// 										width: 150,
// 										backgroundSize: 'cover',
// 										backgroundPosition: 'center',
// 										backgroundImage: `url(${apiUrl}${projet.projet_image})`,
// 										boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.5)',
// 										display: 'flex',
// 										alignItems: 'center',
// 										justifyContent: 'center',
// 										overflow: 'hidden',
// 									}}
// 								>
// 									<Box
// 										sx={{
// 											backgroundColor: 'rgba(0, 0, 0, 0.5)',
// 											color: '#fff',
// 											width: '100%',
// 											height: '100%',
// 											display: 'flex',
// 											justifyContent: 'center',
// 											alignItems: 'center',
// 											position: 'relative',
// 											p: 1,
// 											textAlign: 'center',
// 										}}
// 									>
// 										<Typography component="span" color="inherit">
// 											{projet.projet_title}
// 										</Typography>
// 										<Tooltip title="Supprimer">
// 											<IconButton
// 												sx={{ position: 'absolute', top: 8, right: 0 }}
// 												onClick={() => deleteProjet(projet.projet_id)}
// 											>
// 												<DeleteIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
// 											</IconButton>
// 										</Tooltip>
// 										<Tooltip title="Modifier">
// 											<IconButton
// 												sx={{ position: 'absolute', top: 8, right: 40 }}
// 												onClick={() => onUpdate(projet)}
// 											>
// 												<EditIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
// 											</IconButton>
// 										</Tooltip>
// 									</Box>
// 								</Box>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</Box>
// 			</DialogContent>
// 			<Box sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
// 				<Buttons text="Ajouter un projet" onClick={handleOpenDialog} />
// 			</Box>
// 			<UpdateProjetDialog
// 				open={openModal}
// 				onClose={handleCloseDialog}
// 				titles={projetToEdit ? "Modifier le projet" : "Ajouter un projet"}
// 				showDescription={showDescription}
// 				refreshProjets={refreshProjets}
// 				projetToEdit={projetToEdit}
// 			/>
// 		</Dialog>
// 	);
// }
//
// ProjetDialog.propTypes = {
// 	open: PropTypes.bool.isRequired,
// 	onClose: PropTypes.func.isRequired,
// 	refreshProjets: PropTypes.func.isRequired,
// 	projets: PropTypes.array,
// };
//
// export default ProjetDialog;