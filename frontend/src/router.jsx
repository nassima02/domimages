import { createBrowserRouter } from 'react-router-dom'
import Template from "./pages/template/template.jsx";
import Accueil from "./pages/acceuil.jsx";
import Login from "./pages/authentification/login.jsx";
import ResetPassword from "./pages/authentification/resetPassword.jsx";
import NewPassword from "./pages/authentification/newPassword.jsx";
import Contact from "./pages/contact.jsx";

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Template />,
		children: [
			{
				path: '/',
				element: <Accueil />,
			},
			{
				path: 'login',
				element: <Login />,
			},
			{
				path: 'resetPassword',
				element: <ResetPassword />,
			},
			{
				path: '/newPassword/:token',
				element: <NewPassword />,
			},
			{
				path: '/contact',
				element: <Contact />,
			},

		],
	},
])