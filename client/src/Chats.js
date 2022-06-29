import './Chats.css';
import Header from './Header';
import Chat from './Chat';

function Chats() {
  return (
    <div>
      <Header />
      <div className='chats'>
        <Chat
        id="1"
        name="Labrador"
        message="Wuff" 
        timestamp="6 mins ago" 
        profilePic="https://yummytw.com/wp-content/uploads/20220316184705_47.jpeg"
        />
        <Chat
        id="2"
        name="Shiba Inu"
        message="Bork" 
        timestamp="1 hr ago" 
        profilePic="https://thehappypuppysite.com/wp-content/uploads/2019/06/Mini-Shiba-Inu-HP-long.jpg"/>
        <Chat
        id="3"
        name="Corgi"
        message="Awooo" 
        timestamp="4 hrs ago" 
        profilePic="https://i.pinimg.com/originals/cb/d4/1f/cbd41fb83c06a915a79ed0ab9ca63789.jpg"/>  
      </div>
    </div>
  );
}

export default Chats;