import { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const SetThemeVariables = () => {
	const theme = useTheme();

	useEffect(() => {
		const root = document.documentElement;

		root.style.setProperty('--primary-main', theme.palette.primary.main);
		root.style.setProperty('--primary-light', theme.palette.primary.light);
		root.style.setProperty('--primary-contrastText', theme.palette.primary.contrastText);

		root.style.setProperty('--secondary-main', theme.palette.secondary.main);

		root.style.setProperty('--background-default', theme.palette.background.default);
		root.style.setProperty('--background-alternate', theme.palette.background.alternate);

	}, [theme]);

	return null;
};

export default SetThemeVariables;
