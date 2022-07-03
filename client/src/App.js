import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Chats from './Chats';
import ChatScreen from './ChatScreen';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SetProfile from './SetProfile';
import Profile from './Profile';
import { API_GETPROFILE } from './constants';
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

function App() {
	const jwtToken = window.localStorage.getItem('jwtToken');
	const [profile, setProfile] = useState([]);
	const [arrivalMessage, setArrivalMessage] = useState(null); //socket傳來的訊息
	const socket = useRef();
	
	useEffect(() => {
	socket.current = io("http://localhost:4000");
	socket.current.on("getMessage", (data) => {
		setArrivalMessage({
			sender: data.senderId,
			receiver: data.receiverId,
			text: data.text,
			createdAt: Date.now(),
		});
	});
	}, []);

	useEffect(() => {
	async function getProfile(jwtToken) {
		return fetch(API_GETPROFILE, {
		headers: new Headers({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwtToken}`,
		}),
		}).then((response) => response.json());
	}

	getProfile(jwtToken).then((json) => {
		if (!json.error) {
		setProfile(json.data);
		return;
		}
	});
	},[jwtToken])

	useEffect(() => {
	if(profile.id){
		socket.current.emit("addUser", profile.id);
		socket.current.on("getUsers", (users) => {
			console.log(users)	
		});
	}
	}, [profile]);
	
	return (
	<div className="App">	
		<BrowserRouter>
		<Routes>			
			<Route path="/" element={<Home />}/>
			<Route path="/chats" element={<Chats />}/>
			<Route path="/chats/:chatId" element={<ChatScreen userid={profile.id} socket={socket} arrivalMessage={arrivalMessage}/>}/>
			<Route path="/profile" element={<Profile profile={profile}/>}/>
			<Route path="/signin" element={<SignIn />}/>
			<Route path="/signup" element={<SignUp />}/>
			<Route path="/setprofile" element={<SetProfile />}/>				
		</Routes>
		</BrowserRouter>
	</div>
	);
}

export default App;
