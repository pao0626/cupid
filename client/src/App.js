import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Home';
import Chats from './Chats';
import ChatScreen from './ChatScreen';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SetProfile from './SetProfile';
import Profile from './Profile';


function App() {
  return (
    <div className="App">    
      <BrowserRouter>
        <Routes>          
          <Route path="/" element={<Home />}/>
          <Route path="/chats" element={<Chats />}/>
          <Route path="/chats/:chatId" element={<ChatScreen />}/>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/signin" element={<SignIn />}/>
          <Route path="/signup" element={<SignUp />}/>
          <Route path="/setprofile" element={<SetProfile />}/>              
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
