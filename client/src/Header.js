import './Header.css';
import { Link } from "react-router-dom";

import PersonIcon from '@mui/icons-material/Person';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { IconButton } from '@mui/material';

function Header() {
	return (
	<div className='header'>
		<Link to="/profile">
		<IconButton>
			<PersonIcon className='header__icon' fontSize='large'/>
		</IconButton>
		</Link>
		<Link to="/">
		<img className='header__logo' 
		src='http://localhost:4000/api/images/cupid.png' 
		alt='cupid logo' />
		</Link>
		<Link to="/chats">
		<IconButton> 
			<QuestionAnswerIcon className='header__icon' fontSize='large' />
		</IconButton>
		</Link>
	</div>
	);
}

export default Header;