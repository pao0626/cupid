import './SignUp.css';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { API_SIGNUP } from './constants';

function Copyright(props) {
	return (
	<Typography variant="body2" color="text.secondary" align="center" {...props}>
		{'Copyright © '}
		<Link color="inherit" href="https://mui.com/">
		Your Website
		</Link>{' '}
		{new Date().getFullYear()}
		{'.'}
	</Typography>
	);
}

const theme = createTheme();

function SignUp() {
	const [shown, setShown] = useState(false);

	async function sendForm(data) {
	//資料轉型
	let object = {};
	data.forEach(function(value, key){
		object[key] = value;
	});
	//fetch user能否註冊api
	return await fetch(API_SIGNUP, {
		body: JSON.stringify(object),
		headers: new Headers({
		'Content-Type': 'application/json'
		}),
		method: 'POST'
	}).then((response) => response.json());
	}

	const handleSubmit = (event) => {
	//防止頁面跳轉
	event.preventDefault();
	const data = new FormData(event.currentTarget);
	sendForm(data).then((json) => {
		if (!json.error) {
		//判斷可註冊，將資料後傳
		window.localStorage.setItem('user', JSON.stringify(json.data.user));
		window.location.href = '/setprofile';
		return;
		}
		// 不可註冊
		window.alert("註冊失敗");
	});
	
	};

	return (
	<ThemeProvider theme={theme}>
		<Container component="main" maxWidth="xl">
		<CssBaseline />
		<Box
			sx={{
			marginTop: 30,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			}}
		>
			<Avatar className='signUp__logo' sx={{ m: 1, bgcolor: 'secondary.main' }}>
			<LockOutlinedIcon sx={{ fontSize: 60 }} />
			</Avatar>
			<h2>
				Sign up
			</h2>
			<Box component="form" Validate onSubmit={handleSubmit} sx={{ mt: 5 }}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
				<TextField
					required
					fullWidth
					name="name"
					id="name"
					label="name"style={{height: 100}}
					InputLabelProps={{
					    style: {
							fontSize: 25,
							height: 90,
						},
					}}
					inputProps={{
				        style: {
							fontSize: 25,
				        	height: 90,
				        	padding: '0 14px',
				        },
					}}
					type="text"
				/>
				</Grid>
				<Grid item xs={12}>
				<TextField
					required
					fullWidth
					name="email"
					id="email"
					label="Email Address"
					style={{height: 100}}
					InputLabelProps={{
					    style: {
							fontSize: 25,
							height: 90,
						},
					}}
					inputProps={{
				        style: {
							fontSize: 25,
				        	height: 90,
				        	padding: '0 14px',
				        },
				}}
					type="email"
				/>
				</Grid>
				<Grid item xs={12}>
				<TextField
					required
					fullWidth
					name="password"
					id="password"
					label="Password"
					style={{height: 100}}
					InputLabelProps={{
					    style: {
							fontSize: 25,
							height: 90,
						},
					}}
					inputProps={{
				        style: {
							fontSize: 25,
				        	height: 90,
				        	padding: '0 14px',
				        },
					}}
					type={`${shown ? 'text' : 'password'}`}
				/>
				</Grid>
				<Grid item xs={12} sx={{ mt: -2}}>
				<FormControlLabel
					control={<Checkbox color="primary" />}
					onClick={() => setShown(!shown)}
					label={<h3>show password</h3>}
				/>
				</Grid>
			</Grid>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 5, mb: 3, fontSize: 25 }}
			>
				Sign Up
			</Button>
			<Grid container justifyContent="flex-end">
				<Grid item>
				<Link href="/signin" variant="body2">
					<h3>Already have an account? Sign in</h3>
				</Link>
				</Grid>
			</Grid>
			</Box>
		</Box>
		<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	</ThemeProvider>
	);
}

export default SignUp;

