import { Box, Typography } from "@mui/material";

function Apropos() {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4, maxWidth: '1280px' }}>
			<Typography variant="h1" component="h1" >
				A PROPOS DE MOI
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, width: '100%' }}>
				<Box sx={{
					padding: {md:4,xs:2},
					display: 'flex',
					justifyContent: 'center',
					width: {
						xs: '100%',
						md: '40%'
					}
				}}>
					<Box
						component="img"
						src="/images/auteur.jpeg"
						alt="A propos"
						sx={{
							boxShadow: '0px 4px 10px #16202E',
							width: '100%',
							maxWidth: { xs: '300px', sm: '250px', md: '500px', lg: '500px' }
						}}
					/>
				</Box>
				<Box sx={{ padding: 2, width: '100%', order: { xs: 0, md: 1 } }}>
					<Typography variant="body1" component="p">
						Je me présente, Dominique BRESSION (pseudo:DomImages), photographe amateur autodidacte
						passionné depuis une quinzaine d&apos;années. <br/><br/>
						Après une carrière dans la grande distribution, l&apos;heure de la retraite ayant sonné, je me
						suis investi dans plusieurs activités dont la photographie.<br/><br/>
						Adhérant dans un club photo de ma région (Seine et Marne), qui m&apos;a guidé pour acquérir les
						bases de la photographie. En complément, j&apos;ai suivi quelques stages et une formation en ligne au
						post-traitement.<br/><br/>
						Je vous propose à travers ce site un regard sur mon travail photographique, qui je l&apos;espère
						vous plaira. N’hésitez pas à vous promener dans les différentes galeries qui sont accompagnées
						de textes (histoire des lieux, des personnes, des anecdotes etc.).<br/><br/>
						La photo étant la discipline qui m’apporte le plus d’émotions, ma belle fille Nassima m’a
						proposé de créer ce site, dont l’ambition est de partager mes photos et d’échanger avec les visiteurs de mon site, qui
						voudront bien laisser un avis après leur passage.<br/><br/>
						Je ne suis pas particulièrement un accro de matériel, ce n’est pas l’équipement qui fait faire
						de meilleures photos, c’est le photographe qui avec l’expérience, compose ses photos (ce que le
						matériel ne sait pas faire).<br/><br/>
						Je n’ai pas de spécialités concernant les sujets que je photographie, ça peut-être du paysage,
						du portrait, de la photo de rue, de l’architecture etc.<br/><br/>
						Nous sommes tous perfectibles, donc n&apos;hésitez pas à laisser un commentaire avec des
						critiques constructives (voir onglets avis et contact).<br/><br/>
						Merci de votre visite et à bientôt.
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default Apropos;
