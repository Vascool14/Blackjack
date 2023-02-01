import React, { useState, useEffect } from 'react'
import './App.css'
import dealer from './assets/dealer.png'
import allCards from './Card.jsx'
import backOfCard from './assets/backOfCard.png'

const values = [ '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A' ]
const getRandomCard = () => {
  const suits = [ 'c', 'd', 'h', 's' ] 
  return values[Math.round(Math.random() * 12)]  +  suits[Math.round(Math.random() * 3)];
}
const getPoints = (index) => {
  const points = { '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, 'T':10, 'J':10, 'Q':10, 'K':10, 'A':11 }; 
  return points[String(index).slice(0, 1)];
}

function App() {
  const [ message, setMessage ] = useState('I will be your dealer today! Good luck!'); 
  useEffect(() => {
    const msg = document.getElementById('msg');
    msg.classList.remove('hidden');
    setTimeout(() => {
      msg.classList.add('hidden'); 
    }, 4000);
  }, [message]);
  
  const [ cards, setCards ] = useState([getRandomCard(), getRandomCard()]);
  const [ dealerCards, setDealerCards ] = useState([getRandomCard(), getRandomCard()]);
  const [ myPoints , setMyPoints ] = useState(0);
  const [ dealerPoints , setDealerPoints ] = useState(0);
  const [ cardHidden, setCardHidden ] = useState(true);
  const [ credit , setCredit ] = useState(1000);
  useEffect(() => {
    setMyPoints(0)
    for (let i = 0; i < cards.length; i++) {
      if(cards.length == 2)       setMyPoints(getPoints(cards[0]) + getPoints(cards[1])) 
      else                        setMyPoints(myPoints + getPoints(cards[i]))
  }}, [cards])
  useEffect(() => {
    setDealerPoints(0)
    for (let i = 0; i < dealerCards.length; i++) {
      if(dealerCards.length == 2)  setDealerPoints(getPoints(dealerCards[0]) + getPoints(dealerCards[1])) 
      else                         setDealerPoints(dealerPoints + getPoints(dealerCards[i]))
    }
  }, [dealerCards])
  const newCard = () => {
    if(cards.length < 6 && myPoints < 21) 
    { setCards([...cards, getRandomCard()]);  setMessage(cards.length%2 == 1?'Here you go!':'My pleasure!')}         
    else if(myPoints < 21 ) {setMessage('You lost!'); setCredit(credit -100)}
  }
  const newDealerCard = () => {
    setCardHidden(false);
    setTimeout(() => {    
    if(dealerPoints < myPoints)      setDealerCards([...dealerCards, getRandomCard()]);
  }, 1000);  
  }      
  useEffect(() => {
    if(dealerPoints == myPoints) {
      if(dealerPoints < 17)
        newDealerCard();
      else{  
        setMessage('It\'s a tie!');
        newHand();
      }
    } 
    else  if((dealerPoints < 17 || dealerPoints < 21 && dealerPoints < myPoints) && cardHidden == false) {
      newDealerCard(); 
    }
    else  if(myPoints > dealerPoints && myPoints < 21) {
      setMessage('You won!');
      setCredit(credit + 100);        
    }
    else  if(dealerPoints > myPoints && dealerPoints < 21) {
      setMessage('You lost!');
      setCredit(credit - 100);          
    }
  }, [ dealerPoints])
  function newHand(){
    setCards([]); setDealerCards([]);
  }
  return (
    <div className="App h-screen p-0 m-0 relative flex flex-col justify-center items-center overflow-hidden">
      <div className='mb-32 text-center relative'>
        <div id='msg' className='hidden w-auto absolute' style={{margin: '0 60% 0  2rem', minWidth: '6rem'}}>
          <div className='rounded-md bg-yellow-50 font-semibold px-2 py-1 text-center'>{message}</div>
          <div id='msgArrow' className='w-3 h-3 absolute right-4'></div>
        </div>
        <img src={dealer} alt="dealer" className='max-h-80'/>
        {/* DEALER'S CARDS */}
        <div id='dealerCards' className='absolute flex flex-row'>
          {dealerCards.map((index, key) => {
            return <img  key={key} src={key == 0 && cardHidden ? backOfCard :allCards[index]} alt='card' 
            className='w-14 lg:w-18 -ml-6 rounded'/>
        })}
        </div>
      </div>
      {/* MY CARDS */}
      <div id='myCards' className='absolute flex flex-row '>
        {cards.map((index, key) => {
            return <img id='card' key={key} src={allCards[index]} alt='card' className='shadow-lg'/>
        })}
      </div>
      <div className='absolute bottom-0 p-6 flex flex-row justify-between items-center max-w-md'>
        <div id="btn" onClick={() => newCard()}><p>Hit</p></div>
        <div className='flex flex-col'>
          <h1 className='text-2xl font-semibold'>{myPoints} points</h1>
          <h1 className='text-2xl font-semibold'>{dealerPoints} dealer</h1>
        </div>
        <div id="btn" onClick={() => newDealerCard()}><p>Stand</p></div>
      </div>
      <h1 className='absolute top-3 left-4 text-2xl text-slate-200 font-semibold'>Credit: {credit}</h1>
    </div>
  );
}

export default App;
