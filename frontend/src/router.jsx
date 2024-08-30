import { createBrowserRouter } from 'react-router-dom'
import Template from "./pages/template/template.jsx";
import Accueil from "./pages/acceuil.jsx";

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Template />,
		children: [
			{
				path: '/',
				element: <Accueil />,
			},

		],
	},
])