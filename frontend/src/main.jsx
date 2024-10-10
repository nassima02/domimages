import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthProvider } from './AuthContext';
import { router } from './router.jsx';
import SetThemeVariables from './assets/setThemeVariables';
import './index.css';

const theme = createTheme({
    palette: {
        primary: {
            main:'#16202E',
            light:'#223958',// Teinte claire de la couleur principale
            contrastText:'#ffffff' // Couleur du texte contrastant avec `main`
        },
        secondary: {
            main:'#cdbe8c',
            light:'#E4BF68',// Teinte claire de la couleur principale
        },
        background: {
            default: '#eaebec',
            alternate: '#fff', // Couleur d'arrière-plan supplémentaire
        },
    },
    typography: {
        fontFamily: 'Roboto, sans-serif',
        h1: {
            color: 'var(--primary-light)',
            marginBottom:'2rem',
            fontSize: '1.75rem',
            '@media (min-width:600px)': {
                fontSize: '2rem',
            },
        },
        h2: {
            color: 'var(--primary-light)',
            marginBottom: '1.5rem',
            marginTop: '1.5rem',
            fontSize: '1.25rem',
            '@media (min-width:600px)': {
                fontSize: '1.5rem',
            },
        },
        body1: {
            color: 'var(--primary-main)',
            fontSize: '1.10rem',
            '@media (min-width:600px)': {
                fontSize: '1.125rem',
            },
        },
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <SetThemeVariables />
                <RouterProvider router={router} />
            </AuthProvider>
        </ThemeProvider>
    </React.StrictMode>
);
