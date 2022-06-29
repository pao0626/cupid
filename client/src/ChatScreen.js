import "./ChatScreen.css";
import Header from './Header';

import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { Avatar } from "@mui/material";
import webSocket from 'socket.io-client'


const ChatScreen = () => {
  let { chatId } = useParams();
  const [ws,setWs] = useState();
  const room = "房間1";

  const connectWebSocket = () => {  
      setWs(webSocket('http://localhost:4000'))
      console.log("start connect");
    }

  // useEffect(()=>{
  //   connectWebSocket();
  // },[])

  useEffect(()=>{
      if(ws){
          //連線成功在 console 中打印訊息
          console.log('success connect!')
          //設定監聽
          initWebSocket()
          ws.emit('addRoom', room)
      }
  },[ws])

  const disConnectWebSocket = () =>{
    //向 Server 送出申請中斷的訊息，讓它通知其他 Client
    ws.emit('disConnection', 'XXX')
  }

  const initWebSocket = () => {
    //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
    ws.on('getMessage', message => {
        console.log(message)
    })
    //增加監聽
    ws.on('addRoom', message => {
        console.log(message)
    })
    //以 leaveRoom 接收有使用者離開聊天的訊息
    ws.on('leaveRoom', message => {
        console.log(message)
    })
    // Server 通知完後再傳送 disConnection 通知關閉連線
    ws.on('disConnection', () => {
        ws.close()
    })
  }

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      name: "Labrador",
      image:
        "https://yummytw.com/wp-content/uploads/20220316184705_47.jpeg",
      message: "Hey",
    },
    {
      name: "Labrador",
      image:
        "https://yummytw.com/wp-content/uploads/20220316184705_47.jpeg",
      message: "I like you ",
    },
    {
      message: "yo",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    setMessages([...messages, { message: input }]);
    setInput("");
    ws.emit('getMessage', input)
  };
  return (
    <div>
      <Header />
      <div className="chatScreen">
        <p className="chatScreen__timestamp">
          YOU MATCHED WITH LABRADOR ON 08/21/2020
        </p>
         <div>
            <input type='button' value='斷線' onClick={disConnectWebSocket} />
        </div>
        {/* 下面加入unique key */}
        {messages.map((message) => 
          message.name ? (
            <div className="chatScreen__message" >
              <Avatar
                className="chatScreen__image"
                alt={message.name}
                src={message.image}
              />
              <p className="chatScreen__text">{message.message}</p>
            </div>
          ) : (
            <div className="chatScreen__message" >
              <p className="chatScreen__owntext">{message.message}</p>
            </div>
          )
        )}
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
  );
};

export default ChatScreen;