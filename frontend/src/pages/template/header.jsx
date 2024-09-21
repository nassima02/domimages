import { useState, useContext, useEffect } from 'react';
import { AppBar, IconButton, Toolbar, Tabs, Tab, Box, useMediaQuery, Menu, MenuItem, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../../AuthContext';

const Header = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [value, setValue] = useState(0);
	const [navAnchorEl, setNavAnchorEl] = useState(null);
	const [profileAnchorEl, setProfileAnchorEl] = useState(null);
	const { user, logout } = useContext(AuthContext);
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
	const iconSize = isSmallScreen ? '65px' : '80px';

	// Scroller vers le haut à chaque changement de route
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	useEffect(() => {
		const path = location.pathname;
		if (path === '/') {
			setValue(0);
		} else if (path === '/galeries' || path.includes('/category/')) {
			setValue(1);
		} else if (path === '/lesProjets' || path.includes('/projet/')) {
			setValue(2);
		} else if (path === '/blog') {
			setValue(3);
		} else if (path === '/lesAvis') {
			setValue(4);
		} else if (path === '/apropos') {
			setValue(5);
		} else if (path === '/contact') {
			setValue(6);
		} else {
			setValue(0); // Default value for unrecognized routes
		}
	}, [location.pathname]);

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleNavMenuClick = (event) => {
		setNavAnchorEl(event.currentTarget);
	};

	const handleNavMenuClose = () => {
		setNavAnchorEl(null);
	};

	const handleProfileMenuClick = (event) => {
		setProfileAnchorEl(event.currentTarget);
	};

	const handleProfileMenuClose = () => {
		setProfileAnchorEl(null);
	};

	return (
		<AppBar position="fixed" sx={{
			background: 'var(--primary-main)',
			boxShadow: '0 2px 2px rgba(154, 137, 104,1)',
			flexDirection: 'row',
			justifyContent: 'center',
			zIndex: 1300,
			width: '100%',
		}}>
			<Toolbar sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '10px',
				maxWidth: '1280px',
				flexGrow: 1,
				margin: '0 auto'
			}}>
				<img src="/images/logo.png" alt="Logo" style={{ height: iconSize }} />
				{isSmallScreen ? (
					<Box>
						<IconButton edge="start" color="inherit" aria-label="menu" onClick={handleNavMenuClick}>
							<MenuIcon fontSize='large' />
						</IconButton>
						<Menu
							anchorEl={navAnchorEl}
							open={Boolean(navAnchorEl)}
							onClose={handleNavMenuClose}
						>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/">Accueil</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/galeries">Galeries</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/lesProjets">Projets</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/blog">Blog</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/lesAvis">Avis</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/apropos">A propos</MenuItem>
							<MenuItem onClick={handleNavMenuClose} component={Link} to="/contact">Contact</MenuItem>
						</Menu>
						{user && user.isAdmin && (
							<>
								<IconButton onClick={handleProfileMenuClick}>
									<Avatar
										style={{ width: "30px", height: '30px' }}
										alt="Profile Picture"
										src="/images/auteur.jpeg"
									/>
								</IconButton>
								<Menu
									anchorEl={profileAnchorEl}
									open={Boolean(profileAnchorEl)}
									onClose={handleProfileMenuClose}
								>
									<MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
								</Menu>
							</>
						)}
					</Box>
				) : (
					<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end!important' }}>
						<Tabs
							value={value}
							onChange={handleChange}
							textColor='var(--primary-contrastText)'
							centered
							sx={{
								'& .MuiTabs-indicator': {
									backgroundColor: 'var(--secondary-main)',
								},
								'& .MuiTab-root': {
									position: 'relative',
									overflow: 'hidden',
									fontSize: '0.9rem',
									'&.Mui-selected': {
										color: 'var(--secondary-main)',
									}
								}
							}}
						>
							<Tab label="Accueil" component={Link} to="/" />
							<Tab label="Galeries" component={Link} to="/galeries" />
							<Tab label="Projets" component={Link} to="/lesProjets" />
							<Tab label="Blog" component={Link} to="/blog" />
							<Tab label="Avis" component={Link} to="/lesAvis" />
							<Tab label="A propos" component={Link} to="/apropos" />
							<Tab label="Contact" component={Link} to="/contact" />
						</Tabs>
						{user && (
							<>
								<IconButton onClick={handleProfileMenuClick}>
									<Avatar
										style={{ width: "30px", height: '30px' }}
										alt="Profile Picture"
										src="/images/auteur.jpeg"
									/>
								</IconButton>
								<Menu
									anchorEl={profileAnchorEl}
									open={Boolean(profileAnchorEl)}
									onClose={handleProfileMenuClose}
								>
									<MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
								</Menu>
							</>
						)}
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;


