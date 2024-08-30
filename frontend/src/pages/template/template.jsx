import { Outlet } from 'react-router-dom';
import Header from "./header.jsx";
import Footer from "./footer.jsx";

function Template() {
	return (
		<div style={{
			flexGrow: 1,
			display: 'flex',
			flexDirection: 'column',
			minHeight: '100vh',
			overflow: 'hidden',
		}}>
			<Header/>
			<main style={{ paddingTop: '104px' }}>
				<Outlet />
				{/**Utilisation du composant Outlet pour rendre les routes enfants. */}
			</main>
			<Footer/>
		</div>
	);
}

export default Template;