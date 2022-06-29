import Header from './Header';
import SignIn from './SignIn';
import { useState, useEffect } from "react";
import TinderCards from './TinderCards';
import { API_GETPROFILE } from './constants';

function Home() {
  const jwtToken = window.localStorage.getItem('jwtToken');
  
  return (
    <div >
      {jwtToken ? (
        <div>
          <Header />
          <TinderCards jwtToken={jwtToken}/>
        </div>
      ):(
        <SignIn/>
      )
      }
    </div>
  );
}

export default Home;