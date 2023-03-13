import React, { useState, useEffect } from 'react'
import './App.css'
import dealer from './assets/dealer.png'
import allCards from './Card.jsx'
import coin from './assets/coin.svg'
import backOfCard from './assets/backOfCard.png'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const values = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ]
const getRandomCard = () => {
  const suits = [ 'c', 'd', 'h', 's'] 
  return values[Math.round(Math.random() * 12)] + suits[Math.round(Math.random() * 3)];
}
const getCardPoints = (index) => {
  const points = { '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'T':10, 'J':10, 'Q':10, 'K':10, 'A':11 }; 
  return points[String(index).slice(0, 1)];
}
const Points = ( array ) =>{
  let points = 0;
  for (let i = 0; i < array.length; ++i) {
    points += getCardPoints(array[i])
  }
  return points;
}

function App() {
  const [ message, setMessage ] = useState('I will be your dealer today! Good luck!'); 
  useEffect(() => {
    const msg = document.getElementById('msg');
    msg.classList.remove('hidden');
    setTimeout(() => {      msg.classList.add('hidden');     }, 3500);
  }, [message]);
  const [parent, enableAnimations] = useAutoAnimate({ duration: 300, easing: 'ease-out' });
  
  const [ cards, setCards ] = useState([getRandomCard(), getRandomCard()]);
  const [ dealerCards, setDealerCards ] = useState([getRandomCard(), getRandomCard()]);
  const [ cardHidden, setCardHidden ] = useState(true);
  const [ credit, setCredit ] = useState(1000);
  const [ stand, setStand ] = useState(false);
  const [ stake, setStake ] = useState(100);
  const [ showStakes, setShowStakes ] = useState(false);
  const [ move, setMove ] = useState(false);

  const [ myPoints, setMyPoints ] = useState(Points(cards));
  useEffect(() => { 
    setMyPoints(Points(cards));   
    if(Points(cards) > 21) {
      setMessage(`You lost ${stake}!`); 
      setCredit(credit - stake); 
      newHand(); 
    }
  }, [cards]);
  const [ dealerPoints, setDealerPoints ] = useState(Points(dealerCards));
  useEffect(() => { setDealerPoints(Points(dealerCards));
    if(Points(dealerCards) > 21) {
      setMessage(`You win ${stake}!`);
      setCredit(credit + stake);
      newHand();
    }
  }, [dealerCards]);

  const newCard = () => {
    if(myPoints < 21 && !stand && credit) { 
        setCards([...cards, getRandomCard()]);
      if(myPoints < 21) 
        setMessage(cards.length%2 == 1?'Here you go!':'My pleasure!');
      else if(myPoints == 21){
        setMessage('You win!');
        setCredit(credit + stake);
        newHand();
      }
    }
  }

  const Stand = () => {
    setStand(true);
    setCardHidden(false);
    if(Points(dealerCards) < 17 || Points(dealerCards) < myPoints ){
      setTimeout(() => { setDealerCards([...dealerCards, getRandomCard()]) }, 2000);
    } 
    setTimeout(() => {
      if(dealerPoints == myPoints) {
        setMessage('It\'s a tie!');
        newHand();
      } 
      if(dealerPoints > myPoints && dealerPoints < 21) {
        setMessage(`You lost ${stake}!`); 
        setCredit(credit - stake); 
        newHand();
      }
      else if(myPoints > dealerPoints && myPoints < 21) {
        setMessage(`You win ${stake}!`);
        setCredit(credit + stake);
        newHand();
      }
    }, 3000); 
    
  } 

  // when the game should reset after a win or loss
  function newHand(){
    setTimeout(() => {
      setMove(true); 
    }, 2000);
    setTimeout(() => {  
      setMessage('New hand!');
      setDealerCards([]);
      setCards([]);
      setMyPoints(0);
      setDealerPoints(0);
    }, 3000);
    setTimeout(() => { 
      setCards([getRandomCard(), getRandomCard()]); 
      setDealerCards([getRandomCard(), getRandomCard()]);
      setStand(false); 
      setCardHidden(true);
      setMove(false); 
    }, 5000);
  }

  useEffect(() => {  if(credit == 0) {
    setMessage('You lost all your money!'); 
  }}, [credit])
  // useEffect(() => {  setMessage('Your stake is now ' + stake + '!');  }, [stake])
  return (
    <div className="App h-screen p-0 m-0 relative flex flex-col justify-center items-center overflow-hidden">
      {/* Navbar */}
      <nav className="fixed text-slate-200 w-full flex items-center justify-between top-0 left-0 p-4 md:selection:px-8 z-50">
        <div id='stake' className='text-2xl font-semibold flex items-center h-9 w-auto mr-4 relative'>Stake: &nbsp;
          <div className='z-10' onClick={() => setShowStakes(!showStakes)}>{stake}</div>
          <header className='transition-all duration-300 absolute right-0 top-12 flex flex-col gap-1' style={{ transform: showStakes ? 'translateY(0)' : 'translateY(-100vh)'}}>
            <div onClick={() => {setStake(100); setShowStakes(false)}}>100</div>
            <div onClick={() => {setStake(200); setShowStakes(false)}}>200</div>
            <div onClick={() => {setStake(300); setShowStakes(false)}}>300</div>
            <div onClick={() => {setStake(400); setShowStakes(false)}}>400</div>
            <div onClick={() => {setStake(500); setShowStakes(false)}}>500</div>
            <div onClick={() => {setStake(1000); setShowStakes(false)}}>1000</div>
          </header>
        </div>
        <div className='text-2xl font-semibold flex items-center h-9'>
          <img src={coin} className='h-full' alt="coin" />&nbsp;
          {credit}
        </div>
      </nav>

      {/* Dealer things */}
      <div className='mb-32 text-center relative'>
        <div id='msg' className='hidden w-auto absolute' style={{margin: '0 60% 0  2rem', minWidth: '6rem'}}>
          <div className='rounded-md bg-yellow-50 font-semibold px-2 py-1 text-center'>{message}</div>
          <div id='msgArrow' className='w-3 h-3 absolute right-4'></div>
        </div>
        <img src={dealer} alt="dealer" className='min-w-[30vw] max-w-[26rem] aspect-auto'/>
        {/* DEALER'S CARDS */}
          {stand && <h1 className='absolute top-[57%] left-[38%] drop-shadow-2xl text-2xl font-semibold text-slate-200 text-center mt-20'>{dealerPoints} points</h1>}
          <div ref={parent} id="dealerCards" className='absolute flex flex-row'>
            {dealerCards.map((index, key) => {
              return <img  key={key} src={key == 0 && cardHidden ? backOfCard :allCards[index]} alt='card' 
              className='w-14 lg:w-18 -ml-6 rounded'/>
           })}
        </div>
      </div>

      {/* MY CARDS */}
      <div id='myCards' className='absolute flex items-center gap-6 max-w-full'>
        {/* HIT */}    <div id="btn" onClick={() => newCard()}><p>Hit</p></div>
        <div>
          <div ref={parent} className='flex'>
            {cards.map((index, key) => {
                return <img id='card' key={key} src={allCards[index]} alt='card' className='shadow-lg transition-all duration-300' 
                style={{transform: move? 'translateX(-120vw)': 'translateX(0)'}}/>
            })}
          </div>
          <h1 className='text-2xl font-semibold text-white text-center'>{myPoints} points</h1>
        </div>
        {/* STAND */}    <div id="btn" onClick={() => Stand()}><p>Stand</p></div>
      </div>
      {/* Split button */}
      {cards.length ==2 && cards[0].slice(0,1) == cards[1].slice(0,1) && <div id="btn" onClick={() => {}}><p>Split</p></div>}
    </div>
  );
}

export default App;
