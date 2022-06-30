import './Chats.css';
import Header from './Header';
import Chat from './Chat';
import { API_GETCOVERSATION } from './constants';
import { useState, useEffect } from "react";

function Chats() {
  const jwtToken = window.localStorage.getItem('jwtToken');
  const [chats, setChats] = useState([]);

  async function getCoversation(jwtToken) {
    return fetch(API_GETCOVERSATION, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  }

  useEffect(() => {
    getCoversation(jwtToken).then((json) => {
      if (json.error) {
        window.alert("User db error");
        return;
      }
      setChats(json.allChatsInfo)
    });
  },[])

  return (
    <div>
      <Header />
      <div className='chats'>
        {chats.map(c=>(
          <Chat
            key={c.id}
            id={c.id}
            name={c.name}
            message="Wuff" 
            timestamp="6 mins ago" 
            profilePic={c.main_imageURL}
          />
        ))}  
      </div>
    </div>
  );
}

export default Chats;