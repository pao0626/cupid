import "./ChatScreen.css";
import Header from './Header';

import { useState, useEffect, useRef } from 'react'
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import { API_GETMESSAGE, API_SAVEMESSAGE } from "./constants";

const ChatScreen = (props) => {
	const jwtToken = window.localStorage.getItem('jwtToken');
	const {chatId, chatIdInt = +chatId} = useParams(); // 聊天的對象 並把string轉成number
	const [pairInfo, setPairInfo] = useState([]); // 聊天的對象資料
	const [input, setInput] = useState(""); // 新輸入訊息
	const [messages, setMessages] = useState([]);	// 已有的聊天室訊息
	const [matchTime, setMatchTime] = useState(); // 配對時間
	const UTCTimeObj = new Date(matchTime); // 時間處理
	const scrollRef = useRef(); // 用於控制自動滑到最新訊息
	useEffect(() => {
		getMessage(chatIdInt,jwtToken).then((json) => {
			if (!json.error) {
			setMessages(json.result.messageHistory);
			setPairInfo(json.result.pairInfo);
			setMatchTime(json.result.pairInfo[0].match_time);
			return;
			}
			console.log(json.error);
		});
	}, []);

	async function getMessage(pairID,jwtToken) {
		return await fetch(`${API_GETMESSAGE}?id=${pairID}`, {
			headers: new Headers({
			'Content-Type': 'application/json',
			Authorization: `Bearer ${jwtToken}`
			}),
		}).then((response) => response.json());
	}

	async function saveMessage(data,jwtToken) {
	return await fetch(API_SAVEMESSAGE, {
		body: JSON.stringify(data),
		headers: new Headers({
		'Content-Type': 'application/json',
		Authorization: `Bearer ${jwtToken}`
		}),
		method: 'POST'
	}).then((response) => response.json());
	}

	const handleSend = (e) => {
		e.preventDefault();

		props.socket.current.emit("sendMessage", {
			senderId: props.userid,
			receiverId: chatIdInt,
			text: input,
		});

		const recordMessage = {
			text: input,
			receiver: chatIdInt,
		};

		saveMessage(recordMessage,jwtToken).then((json) => {
			if (!json.error) {
				setMessages([...messages, { text: input }]);
				setInput("");
				return;
			}
			console.log(json.error);
		});
	};

	useEffect(() => {
		props.arrivalMessage &&
			setMessages((prev) => [...prev, props.arrivalMessage]);
	}, [props.arrivalMessage]);

	useEffect(() => {
		scrollRef.current?.scrollIntoView();
	}, [messages]);

	return (
	<div>
		<Header />
		<div className="chatScreen">
		{pairInfo.length>0 && <p className="chatScreen__timestamp">
			YOU MATCHED WITH LABRADOR ON {UTCTimeObj.toLocaleDateString()}
			</p>
		}
		<div className="chatScreen__container">
			{messages.map((message) => 
			(message.sender === chatIdInt) ? (
				<div className="chatScreen__message" key={message.id} ref={scrollRef}>
					<Avatar
						className="chatScreen__image"
						alt="photo"
						src={pairInfo[0]?.main_imageURL}
					/>
					<p className="chatScreen__text">{message.text}</p>
				</div>
			) : (
				<div className="chatScreen__message" key={message.id} ref={scrollRef}>
					<p className="chatScreen__owntext">{message.text}</p>
				</div>
			)
			)}
		</div>
		<div>
			<form className="chatScreen__form">
			<input
				className="chatScreen__input"
				placeholder="輸入新訊息"
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button
				onClick={handleSend}
				type="submit"
				className="chatScreen__button"
			>
				SEND
			</button>
			</form>
		</div>
		</div>
	</div>
	);
};

export default ChatScreen;