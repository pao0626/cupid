import './SignIn.css';
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
import {API_SIGNIN} from './constants'



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

function SignIn() {
	const [shown, setShown] = useState(false);

	async function sendForm(data) {
	let object = {};
	data.forEach(function(value, key){
		object[key] = value;
	});
	return await fetch(API_SIGNIN, {
		body: JSON.stringify(object),
		headers: new Headers({
		'Content-Type': 'application/json'
		}),
		method: 'POST'
	}).then((response) => response.json());
	}

	const handleSubmit = ((event) => {
	event.preventDefault();
	const data = new FormData(event.currentTarget);
	sendForm(data).then((json) => {
		 if (!json.error) {
		window.localStorage.setItem('jwtToken', json.data.access_token);
		window.location.href = '/';
		return;
		}
		// 不可登入
		window.alert("登入失敗");
	});
	});


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
			<Avatar className='signIn__logo' sx={{ m: 1, bgcolor: 'secondary.main', } }>
				<LockOutlinedIcon sx={{ fontSize: 60 }}/>
			</Avatar>
			<h2>
				Sign in
			</h2>
			<Box component="form"	Validate onSubmit={handleSubmit} sx={{ mt: 5 }}>
			<TextField 
				margin="normal"
				required
				fullWidth
				id="email"
				name="email"
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
			<TextField
				margin="normal"
				required
				fullWidth
				id="password"
				name="password"
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
			<FormControlLabel
				control={<Checkbox color="primary" />}
				onClick={() => setShown(!shown)}
				label={<h3>show password</h3>}
				sx={{fontSize: 25}}
			/>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{ mt: 5, mb: 3, fontSize: 25 }}
			>
				Sign In
			</Button>
			<Grid container justifyContent="flex-end">
				{/* <Grid item xs>
				<Link href="#" variant="body2">
					<h3>Forgot password?</h3>
				</Link>
				</Grid> */}
				<Grid item>
				<Link href="/signup" variant="body2">
					<h3>Don't have an account? Sign Up</h3>
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

export default SignIn;