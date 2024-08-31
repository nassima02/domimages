import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import CopyrightIcon from '@mui/icons-material/Copyright';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from "react-router-dom";
import VisitCounter from "../../visitCounter.jsx";
import {useContext} from "react";
import {AuthContext} from "../../AuthContext.jsx";

const Footer = () => {
	const theme = useTheme();
	const { user } = useContext(AuthContext);
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const iconSize = isSmallScreen ? '25px' : '25px';
	const commonIconButtonProps = {
		component: "a",
		target: "_blank",
		rel: "noopener noreferrer",
		sx: {
			color: 'var(--primary-contrastText)',
			fontSize: iconSize,
			padding: 1,
		},
	};

	return (
		<AppBar position="relative" sx={{
			top: 'auto',
			bottom: 0,
			background: 'var(--primary-main)',
			boxShadow: '0 -2px 2px rgba(154, 137, 104, 1)',
			flexDirection:'row',
			justifyContent: 'center',
			zIndex:0//a 1 pour caché le recaptcha
		}}>
			<Toolbar sx={{
				display: 'flex',
				flexGrow:1,
				justifyContent: isSmallScreen ? 'center' : 'space-between',
				flexDirection: isSmallScreen ? 'column' : 'row',
				alignItems: 'center',
				padding: '10px',
				maxWidth:'1280px',
			}}>
				<Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mb: isSmallScreen ? 1 : 0}}>
					<img src="/images/logo.png" alt="Logo" style={{height: '65px'}}/>
				</Box>

				<Box sx={{display: "flex", gap:{xs:1, md:2} , flexDirection: {xs: "column", md:'row' } }}>
						<Box sx={{display:'flex', justifyContent:{xs:'center'}}}>
							<CopyrightIcon sx={{fontSize: '1rem', mr: 0.5, aligneSelf:'center'}}/>
							<Typography variant="body2" sx={{fontSize: '0.8rem', color: 'var(--primary-contrastText)', mr: 1}}>2024 </Typography>
							<Typography
								variant="body2"
								component={Link}
								to="/CGU"
								sx={{
									mb: isSmallScreen ? 0.5 : 0,
									fontSize: isSmallScreen ? '0.7rem' : '0.9rem',
									color: 'var(--primary-contrastText)',
									textDecoration: 'none',
								}}
							>
								CGU
							</Typography>
						</Box>
					{user && user.isAdmin === 1 && (
						<VisitCounter/>
					)}
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<IconButton
						href="https://www.facebook.com/profile.php?id=100012140851223"
						{...commonIconButtonProps}
					>
						<FacebookIcon fontSize={iconSize} />
					</IconButton>
					<IconButton
						href="https://www.instagram.com/dominiquebression/"
						{...commonIconButtonProps}
					>
						<InstagramIcon fontSize={iconSize} />
					</IconButton>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Footer;