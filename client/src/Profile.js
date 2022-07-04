import './Profile.css';
import Header from './Header';

import AssignmentIcon from '@mui/icons-material/Assignment';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';


const Profile = (props) => {

	return (
	<div>
		<Header />
		<div className='profile__container'>
		<div 
			style={{ backgroundImage: `url(${props.profile.main_image})`}} //js for css
			className="profile__image"
		/>		 
		</div>	 
		<div className='profile__container1'>
		<div className='profile__block'> 
			<h2 className="profile__name">{props.profile.name}</h2>
			<div className='profile__info'>
			<AssignmentIcon className='profile__category' sx={{ fontSize: 35 }}/>		 
			<p className="profile__text">{props.profile.text}</p>
			</div>
		</div>
		</div>
		<div className='profile__button'>
		<Button 
			variant="outlined"
			startIcon={<LogoutIcon className='profile__LogoutIcon'/>}
			color="secondary" 
			sx={{ fontSize: 30 }}
			onClick={() => {
			window.localStorage.removeItem('jwtToken');
			window.location.href = '/';
			}}
		>
			Sign out
		</Button>
		</div>
	</div>	
	);
};

export default Profile;