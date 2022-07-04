import './Header.css';
import { Link } from "react-router-dom";

import PersonIcon from '@mui/icons-material/Person';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { IconButton } from '@mui/material';
import { API_LOGO } from './constants';

function Header() {
	return (
	<div className='header'>
		<Link to="/profile">
		<IconButton>
			<PersonIcon className='header__icon' sx={{ fontSize: 60 }}/>
		</IconButton>
		</Link>
		<Link to="/">
		<img className='header__logo' 
		src = {API_LOGO}		
		alt='cupid logo' 
		/>
		</Link>
		<Link to="/chats">
		<IconButton> 
			<QuestionAnswerIcon className='header__icon' sx={{ fontSize: 60 }} />
		</IconButton>
		</Link>
	</div>
	);
}

export default Header;