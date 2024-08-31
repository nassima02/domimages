import { createBrowserRouter } from 'react-router-dom'
import Template from "./pages/template/template.jsx";
import Accueil from "./pages/acceuil.jsx";
import Login from "./pages/authentification/login.jsx";
import ResetPassword from "./pages/authentification/resetPassword.jsx";
import NewPassword from "./pages/authentification/newPassword.jsx";
import Contact from "./pages/contact.jsx";
import Apropos from "./pages/apropos.jsx";
import CGU from "./pages/CGU.jsx";
import AvisPage from "./pages/avis/avisPage.jsx";
import BlogPage from "./pages/blog/blogPage.jsx";
import Projets from "./pages/projets/projets.jsx";

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
				path: '/projets',
				element: <Projets />,
			},
			{
				path: '/blog',
				element: <BlogPage />,
			},
			{
				path: '/avis',
				element: <AvisPage />,
			},
			{
				path: '/apropos',
				element: <Apropos />,
			},
			{
				path: '/contact',
				element: <Contact />,
			},
			{
				path: '/CGU',
				element: <CGU />,
			},

		],
	},
])