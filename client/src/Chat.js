import "./Chat.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
        transform: 'scale(.8)',
        opacity: 1,
    },
    '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
    },
  },
}));

const Chat = ({ id, name, message, profilePic, timestamp, online}) => {
	return (
	<Link to={`/chats/${id}`}>
		<div className="chat">
		{(online)?(
		<StyledBadge
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
		>
			<Avatar className="chat__image" alt={name} src={profilePic} />
		</StyledBadge>	
		):(<Avatar className="chat__image" alt={name} src={profilePic} />)
		}
		<div className="chat__details">
			<h2>{name}</h2>
			{/* <p>{message}</p> */}
		</div>
		{/* <p className="chat__timestamp">{timestamp}</p> */}
		</div>
	</Link>
	);
};

export default Chat;