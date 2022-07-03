import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {API_SETPROFILE} from './constants'
import { useState } from 'react';


function Copyright(props) {
	return (
	<Typography variant="body2" color="text.secondary" align="center" {...props}>
		{'Copyright © '}
		<Link color="inherit" href="https://github.com/pao0626">
		Pao Github
		</Link>{' '}
		{new Date().getFullYear()}
		{'.'}
	</Typography>
	);
}

const theme = createTheme();

function SetProfile() {
	const user = JSON.parse(localStorage.getItem('user') || '[]');
	const [userInfo, setUserInfo] = useState(user);
	const [image, setImage] = useState();
	const [imgURL, setImgURL] = useState();

	async function sendForm(data) {
	let object = {};
	data.forEach(function(value, key){
		object[key] = value;
	});

	return await fetch(API_SETPROFILE, {
		body: data,
		method: 'POST'
	}).then((response) => response.json());
	}
	
	const handleImage = ((event) => {
	if(event.target.files && event.target.files[0]){
		setImage(event.target.files[0]);
		setImgURL(URL.createObjectURL(event.target.files[0]));
	}

	});

	const handleSubmit = ((event) => {
	event.preventDefault();
	 
	const data = new FormData(event.currentTarget);
	data.append("name",userInfo.name);
	data.append("email",userInfo.email);
	data.append("password",userInfo.password);
	data.append("role_id",userInfo.role_id);
	const value =	data.get("main_image");
	data.delete("main_image");
	data.append("main_image", value);

	sendForm(data).then((json) => {
		 if (!json.error) {
		window.localStorage.setItem('jwtToken', json.data.access_token);
		window.alert('註冊成功');
		window.location.href = '/';
		return;
		}
		// 不可註冊
		console.log(json.error);
		window.alert("註冊失敗");
	});
	});

	return (
	<ThemeProvider theme={theme}>
		<Container component="main" maxWidth="xs">
		<CssBaseline />
		<Box
			sx={{
			marginTop: 8,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			}}
		>
			<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
			<AssignmentIndIcon/>
			</Avatar>
			<Typography component="h1" variant="h5">
			Personal Info
			</Typography>
			{image && <Box 
			component="img"
			sx={{
				mt: 2,
				width: 300,
			}}
			alt="your image"
			src={imgURL}
			/>
			}
			<Box component="form"	Validate onSubmit={handleSubmit} sx={{ mt: 1 }}>
			<FormControl sx={{ mt: 3 }} required fullWidth>
				<FormLabel id="gender">"You are ..."</FormLabel>
				<RadioGroup
				row
				aria-labelledby="gender"
				name="gender"
				>
				<FormControlLabel value="female" control={<Radio />} label="Female" />
				<FormControlLabel value="male" control={<Radio />} label="Male" />
				</RadioGroup>
			</FormControl>
			<FormControl sx={{ mt: 2 }} required fullWidth>
				<FormLabel id="pair">"Search for ..."</FormLabel>
				<RadioGroup
				row
				aria-labelledby="pair"
				name="pair"
				>
				<FormControlLabel value="female" control={<Radio />} label="Female" />
				<FormControlLabel value="male" control={<Radio />} label="Male" />
				</RadioGroup>
			</FormControl>
			<TextField
				margin="normal"
				required
				fullWidth
				id="text"
				name="text"
				label="Introduction"
				type="textarea"
				maxRows = "2"
				multiline
			/>
			<Button
				variant="contained"				
				component="label"
				sx={{ mt: 2 }} 
				color="primary">
				<AddAPhotoIcon sx={{ mr: 1 }} />	Upload a image (JPG/PNG ONLY)
				<input 
				type="file" 
				name="main_image"
				required 
				onChange={handleImage}
				hidden 
				/>
			</Button>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 3, mb: 2 }}
			>
				Commit
			</Button>
			</Box>
		</Box>
		<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	</ThemeProvider>
	);
}

export default SetProfile;