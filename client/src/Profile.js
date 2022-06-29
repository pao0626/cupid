import './Profile.css';
import { useState, useEffect } from "react";
import Header from './Header';
import { API_GETPROFILE } from './constants';

import AssignmentIcon from '@mui/icons-material/Assignment';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';


const Profile = () => {
  const jwtToken = window.localStorage.getItem('jwtToken');
  const [profile, setProfile] = useState([]);
  
  async function getProfile(jwtToken) {
    return fetch(API_GETPROFILE, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  }

  useEffect(() => {
    getProfile(jwtToken).then((json) => {
      if (!json.error) {
        setProfile(json.data);
        return;
      }
      window.alert("User info error");
    });
  },[])

  return (
    <div>
      <Header />
      <div className='profile__container'>
        <div 
            style={{ backgroundImage: `url(${profile.main_image})`}} //js for css
            className="profile__image"
        />       
      </div>     
      <div className='profile__container1'>
        <div className='profile__block'> 
          <h2 className="profile__name">{profile.name}</h2>
          <div className='profile__info'>
            <AssignmentIcon className='profile__category' />         
            <p className="profile__text">{profile.text}</p>
          </div>
        </div>
      </div>
      <div className='profile__button'>
        <Button 
          variant="outlined"
          startIcon={<LogoutIcon />}
          color="secondary" 
          onClick={() => {
            window.localStorage.removeItem('jwtToken');
            window.location.href = '/';
          }}
        >
          Sign out
        </Button>
      </div>
    </div>  
  );
};

export default Profile;