import './TinderCards.css';
import { useState, useEffect, useRef, useMemo, createRef} from "react";
import TinderCard from "react-tinder-card";
import { API_GETCARDS, API_ISMATCH, API_RECORDCARDS } from './constants';

import { IconButton } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import ReplayIcon from '@mui/icons-material/Replay';
import CloseIcon from '@mui/icons-material/Close';
import StarRateIcon from '@mui/icons-material/StarRate';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Swal from 'sweetalert2'

function TinderCards (props) {
  const [currentIndex, setCurrentIndex] = useState()
  // const [lastDirection, setLastDirection] = useState();
  const [showComment, setShowComment] = useState(false);
  const [people, setPeople] = useState([]);

  async function getCards(jwtToken) {
    return fetch(API_GETCARDS, {
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
    }).then((response) => response.json());
  }

  async function recordCards(data, jwtToken) {
    return fetch(API_RECORDCARDS, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST'
    }).then((response) => response.json());
  }

  async function isMatch(data, jwtToken) {
    return fetch(API_ISMATCH, {
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      }),
      method: 'POST'
    }).then((response) => response.json());
  }

  useEffect(() => {
    getCards(props.jwtToken).then((json) => {
      if (json.error) {
        window.alert("User db error");
        return;
      }
      setPeople(json.cards);
      setCurrentIndex(json.cards.length - 1);
    });
  },[])

  // useRef用來計數
  const currentIndexRef = useRef(currentIndex)
  
  const childRefs = useMemo(
    () =>{
      if(currentIndex >= -1){
        return Array(people.length)
          .fill(0)
          .map((i) => createRef())}},
    [currentIndex]
  )

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const canGoBack = currentIndex < people.length - 1

  const canSwipe = currentIndex >= 0

  // set last direction and decrease current index
  const swiped = (direction, index, otherID) => {
    updateCurrentIndex(index - 1);
    // setLastDirection(direction);
    
    if(direction !== "down"){
      // record swipe, so getCards wonot get again
      recordCards({otherID:otherID, direction:direction} ,props.jwtToken)
      .then((json) => {
        if (json.error) {
          window.alert("Match_record db error");
          return;
          // realGoBack();
        }   
      });
      // if you swipe like , judge can match or not
      if(direction !== "left"){
        isMatch({otherID:otherID} ,props.jwtToken)
        .then((json) => {
          if (json.error) {
            window.alert("Match db error");
            return;
          }
          //alert match
          console.log(json.canMatch.match)
          if(json.canMatch.match){
            Swal.fire({
              icon: 'success',
              title: 'Match',
              showConfirmButton: false,
              timer: 2000
            })
          }   
        });
      }
    }
  }

  const outOfFrame = (name, index) => {
    console.log(`${name} (${index}) left the screen!`, currentIndexRef.current)
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= index && childRefs[index].current.restoreCard()
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  }

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < people.length) {
      await childRefs[currentIndex].current.swipe(dir) // Swipe the card!
    }
  }

  // increase current index and show card
  const goBack = async () => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'You need to pay to upgrade PREMIUM',
    })
    // if (!canGoBack) return
    // const newIndex = currentIndex + 1
    // updateCurrentIndex(newIndex)
    // await childRefs[newIndex].current.restoreCard()
  }

  const realGoBack = async () => {
    if (!canGoBack) return
    const newIndex = currentIndex + 1
    updateCurrentIndex(newIndex)
    await childRefs[newIndex].current.restoreCard()
  }

  return (
    <div>
      <div className='tinderCards__cardContainer'>
        {people.map((person, index) => (
          <TinderCard
            className="swipe"
            ref={childRefs[index]}
            key={person.id}
            onSwipe={(dir) => swiped(dir, index, person.id)}
            onCardLeftScreen={() => outOfFrame(person.name, index)}
            preventSwipe={['down']} // 防止滑動方向
          >
            <div 
              style={{ backgroundImage: `url(${person.main_imageURL})`}} //js for css
              className="card"
            >
              <h3>{person.name}</h3>
              <IconButton className="cards__icon" onClick={() => setShowComment(!showComment)}>
                <ExpandCircleDownIcon color="primary" fontSize='large'/>
              </IconButton>
            </div>
            {showComment && 
              <div className='cards__block'> 
                <AssignmentIcon className='cards__category' />         
                <p className="cards__text">{person.text}</p>
              </div>
            }
          </TinderCard>
        ))}
      </div>
      <div className='swipeButtons'>
        <IconButton className="swipeButtons__repeat" onClick={() => goBack()}>
          <ReplayIcon fontSize="large" />
        </IconButton>
        <IconButton className="swipeButtons__left" onClick={() => swipe('left')}>
          <CloseIcon fontSize="large" />
        </IconButton>
        <IconButton className="swipeButtons__right" onClick={() => swipe('right')}>
          <FavoriteIcon fontSize="large" />
        </IconButton>
        <IconButton className="swipeButtons__star" onClick={() => swipe('up')}>
          <StarRateIcon fontSize="large" />
        </IconButton>
        {/* <IconButton className="swipeButtons__lightning">
          <FlashOnIcon fontSize="large" />
        </IconButton> */}
      </div>
    </div>
  );
}

export default TinderCards;