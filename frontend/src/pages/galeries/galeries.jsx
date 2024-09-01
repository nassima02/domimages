import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Box, Tooltip, Typography } from "@mui/material";
import { AuthContext } from '../../AuthContext';
import useCategories from "./useCategories.jsx";
import CategoryCards from "./categoryCards.jsx";
import CategoryDialog from "./categoryDialog.jsx";

function Galeries() {
	const navigate = useNavigate();
	const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
	const [categories, fetchCategories] = useCategories();
	const { user } = useContext(AuthContext); // Accédez à l'utilisateur actuel

	const handleOpenCategoryDialog = () => {
		setOpenCategoryDialog(true);
	};

	const handleCloseCategoryDialog = () => {
		setOpenCategoryDialog(false);
	};

	const updateCategories = () => {
		fetchCategories();
	};

	const handleCategoryClick = (categoryId) => {
		navigate(`/category/${categoryId}`);
	};

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1280px', width: '100%', paddingTop: 4}}>
			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', textAlign: 'center' }}>
				<Typography variant="h1" component="h1">
					GALERIES
				</Typography>
				{user && user.isAdmin && ( // Vérifiez si l'utilisateur est admin avant d'afficher l'icône
					<Tooltip title="modifier">
						<EditNoteIcon sx={{ color: "var(--primary-light)", fontSize: '2rem', cursor: 'pointer', mb: '2rem' }} onClick={handleOpenCategoryDialog} />
					</Tooltip>
				)}
			</Box>
			<Typography variant="body1" component="p">
				Explorez mes photographies par thème
			</Typography>
			<CategoryCards categories={categories} onCategoryClick={handleCategoryClick} />
			<CategoryDialog open={openCategoryDialog} onClose={handleCloseCategoryDialog} updateCategories={updateCategories} refreshCategories={fetchCategories} categories={categories} />
		</Box>
	);
}

export default Galeries;