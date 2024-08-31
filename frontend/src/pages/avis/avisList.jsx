import {Box, Typography, IconButton, Divider, Tooltip} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';
import {formatDistanceToNow} from 'date-fns';
import {fr} from 'date-fns/locale';
import {useContext, useState} from 'react';
import AvisForm from './avisForm';
import {AuthContext} from "../../AuthContext.jsx";

const AvisList = ({avis, onDelete, onSubmitReply, onDeleteReply}) => {
	// État local pour suivre l'avis pour lequel afficher le formulaire de réponse
	const [replyingTo, setReplyingTo] = useState(null);
	const {user} = useContext(AuthContext);//permet de savoir si l'utilisateur connecter est un administrateur ou pas

	// Fonction pour gérer le clic sur "Répondre"
	const handleReplyClick = (id) => {
		setReplyingTo(replyingTo === id ? null : id);
	};

	// Fonction pour gérer l'annulation du formulaire de réponse
	const handleCancelReply = () => {
		setReplyingTo(null);
	};

	return (
		<Box>
			{avis.map((avisItem) => (
				<Box key={avisItem.id} sx={{mb: 3}}>
					<Box>
						{/* Avis */}
						<Box sx={{display: 'flex', flexDirection: 'column'}}>
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									width: {xs: '90%', sm: '80%', md: '70%'},
									background: '#d9dde2',
									borderLeft: '8px solid var(--primary-main)!important',
									borderRadius: '0 10px 10px 0',
									boxSizing: 'border-box',
									p: 2,
									mb: 1
								}}
							>
								<Box sx={{
									display: 'flex',
									width: '100%',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}>
									<Box sx={{display: 'flex', flexDirection: 'column'}}>
										<Typography variant="subtitle1"
										            sx={{color: 'var(--primary-main)', fontWeight: 'bold'}}>
											{avisItem.name || 'Anonymous'}
										</Typography>
									</Box>
									{user && user.isAdmin === 1 && (
										<Box sx={{display: 'flex', gap: 2}}>
											<Tooltip title="Répondre">
												<IconButton
													size="small"
													onClick={() => handleReplyClick(avisItem.id)}
													sx={{p: 0}}
												>
													<QuestionAnswerIcon
														sx={{color: 'var(--primary-main)', fontSize: '20px'}}/>
												</IconButton>
											</Tooltip>
											<Tooltip title="Supprimer">
												<IconButton size="small" onClick={() => onDelete(avisItem.id)} sx={{p: 0}}>
													<DeleteIcon sx={{color: 'var(--primary-main)', fontSize: '20px'}}/>
												</IconButton>
											</Tooltip>
										</Box>
									)}
								</Box>
								<Divider sx={{backgroundColor: 'var(--primary-main)', mb: 1}}/>
								<Typography variant="body1" sx={{color: 'var(--primary-main)'}}>
									{avisItem.comment}
								</Typography>

							</Box>
							{/* Date de l'avis */}
							<Box sx={{
								display: 'flex',
								justifyContent: 'flex-end',
								boxSizing: 'border-box',
								width: {xs: '90%', sm: '80%', md: '70%'},
							}}>
								<Typography variant="subtitle2" sx={{color: 'var(--primary-main)', fontSize: '0.8rem', textWrap: 'nowrap'}}>
									{formatDistanceToNow(new Date(avisItem.created_at), {addSuffix: true, locale: fr})}
								</Typography>
							</Box>

						</Box>

						{/* Réponses */}
						{replyingTo === avisItem.id && (
							<AvisForm
								onSubmit={(reply) => {
									onSubmitReply(reply, avisItem.id);
									handleCancelReply(); // Réinitialiser l'état du formulaire après l'envoi
								}}
								onCancel={handleCancelReply}
							/>
						)}
						<Box sx={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-end'
						}}>
							{avisItem.replies && avisItem.replies.map((reply) => (
								<Box key={reply.id} sx={{
									pt: 2,
									pb: 2,
									display: 'flex',
									flexDirection: 'column',
									width: {xs: '90%', sm: '80%', md: '70%'}
								}}>
									<Box
										sx={{
											background: '#223958',
											borderLeft: '8px solid var(--secondary-main)!important',
											borderRadius: '0 10px 10px 0',
											p: 2,
											mb: 1
										}}
									>
										<Box sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center'
										}}>
											<Box sx={{display: 'flex', flexDirection: 'column'}}>
												<Typography variant="subtitle1" sx={{color: '#fff', fontWeight: 'bold'}}>
													{reply.name || 'Anonymous'}
												</Typography>
											</Box>
											{user && user.isAdmin === 1 && (
												<Box sx={{display: 'flex', gap: 2}}>
													<Tooltip title="Répondre">
														<IconButton size="small" onClick={() => handleReplyClick(avisItem.id)} sx={{p: 0}}>
															<QuestionAnswerIcon
																sx={{color:  '#fff', fontSize: '20px'}}/>
														</IconButton>
													</Tooltip>
													<Tooltip title="Supprimer">
														<IconButton size="small" onClick={() => onDeleteReply(avisItem.id, reply.id)} sx={{p: 0}}>
															<DeleteIcon
																sx={{color:  '#fff', fontSize: '20px'}}/>
														</IconButton>
													</Tooltip>
												</Box>
											)}
										</Box>
										<Divider sx={{backgroundColor:  '#fff', mb: 1}}/>
										<Typography variant="body1" sx={{color:  '#fff'}}>
											{reply.reply}
										</Typography>
									</Box>

									<Box sx={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
										<Typography variant="subtitle2" sx={{color: 'var(--primary-main)', fontSize: '0.8rem', textWrap: 'nowrap'}}>
											{formatDistanceToNow(new Date(reply.created_at), {
												addSuffix: true,
												locale: fr
											})}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>
				</Box>
			))}
		</Box>
	);

};

AvisList.propTypes = {
	avis: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string,
			created_at: PropTypes.string.isRequired,
			comment: PropTypes.string.isRequired,
			replies: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.string.isRequired,
					reply: PropTypes.string.isRequired,
					created_at: PropTypes.string.isRequired
				})
			)
		})
	).isRequired,
	onDelete: PropTypes.func.isRequired,
	onSubmitReply: PropTypes.func.isRequired,
	onDeleteReply: PropTypes.func.isRequired,
};

export default AvisList;