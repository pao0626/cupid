import "./ChatScreen.css";
import Header from './Header';

import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import webSocket from 'socket.io-client'
import { API_GETMESSAGE, API_SAVEMESSAGE } from "./constants";


const ChatScreen = () => {
  const jwtToken = window.localStorage.getItem('jwtToken');
  const {chatId} = useParams();
  const [pairInfo, setPairInfo] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [matchTime, setMatchTime] = useState();
  const UTCTimeObj = new Date(matchTime);

  useEffect(() => {
    getMessage(chatId,jwtToken).then((json) => {
      if (!json.error) {
        setMessages(json.result.messageHistory);
        setPairInfo(json.result.pairInfo);
        setMatchTime(json.result.pairInfo[0].match_time)
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
    // ws.emit('getMessage', input)

    const recordMessage = {
      text: input,
      receiver: chatId,
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
            (message.sender === parseInt(chatId)) ? (
              <div className="chatScreen__message" key={message.id}>
                <Avatar
                  className="chatScreen__image"
                  alt={pairInfo[0].name}
                  src={pairInfo[0].main_imageURL}
                />
                <p className="chatScreen__text">{message.text}</p>
              </div>
            ) : (
              <div className="chatScreen__message" key={message.id}>
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