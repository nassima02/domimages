import {useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import useProjets from "./useProjets.jsx";
import ProjetCards from "./projetCards.jsx";
import ProjetDialog from "./projetDialog.jsx";
import EditNoteIcon from '@mui/icons-material/EditNote';
import {Box, Tooltip, Typography} from "@mui/material";
import {AuthContext} from '../../AuthContext';

function Projets() {
	const navigate = useNavigate();
	const [openProjetDialog, setOpenProjetDialog] = useState(false);
	const [projets, fetchProjets] = useProjets();
	const {user} = useContext(AuthContext); // Accédez à l'utilisateur actuel

	const handleOpenProjetDialog = () => {
		setOpenProjetDialog(true);
	};

	const handleCloseProjetDialog = () => {
		setOpenProjetDialog(false);
	};

	const updateProjets = () => {
		fetchProjets();
	};

	const handleProjetClick = (projetId) => {
		navigate(`/projet/${projetId}`);
	};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			maxWidth: '1280px',
			width: '100%',
			paddingTop: 4
		}}>
			<Box sx={{display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', textAlign: 'center'}}>
				<Typography variant="h1" component="h1">
					PROJETS
				</Typography>
				{user && user.isAdmin && (
					<Tooltip title="modifier">
						<EditNoteIcon
							sx={{color: "var(--primary-light)", fontSize: '2rem', cursor: 'pointer', mb: '2rem'}}
							onClick={handleOpenProjetDialog}/>
					</Tooltip>
				)}
			</Box>
			<Typography variant="body1" component="p">
				Explorez mes projets
			</Typography>
			<ProjetCards projets={projets} onProjetClick={handleProjetClick}/>
			<ProjetDialog open={openProjetDialog} onClose={handleCloseProjetDialog} updateProjets={updateProjets}
			              refreshProjets={fetchProjets} projets={projets}/>
		</Box>
	);
}

export default Projets;