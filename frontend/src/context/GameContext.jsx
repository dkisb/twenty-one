import React, { createContext, useReducer, useContext, useState } from 'react';
import { useUser } from './UserContext';

const initialState = {
  yourHand: [],
  dealerHand: [],
  playerBalance: 0,
  dealerBalance: 100,
  totalBet: 0,
  isGameOver: false,
  winner: null,
  stopClicked: false,
  enoughReached: false,
  betSubmitClicked: false,
  nextCardInOrder: 1,
  numberOfCards: 32,
  upperCardData: null,
};

function handValue(hand) {
  return hand.reduce((sum, card) => sum + card.value, 0);
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'RESET_GAME':
      return {
        ...initialState,
        playerBalance: action.playerBalance,
        dealerBalance: action.dealerBalance,
      };
    case 'ADD_PLAYER_CARD': {
      const newHand = [...state.yourHand, action.card];
      return {
        ...state,
        yourHand: newHand,
        upperCardData: action.card,
        nextCardInOrder: state.nextCardInOrder + 1,
        numberOfCards: state.numberOfCards - 1,
        betSubmitClicked: false,
      };
    }
    case 'ADD_DEALER_CARD': {
      const newHand = [...state.dealerHand, action.card];
      return {
        ...state,
        dealerHand: newHand,
        nextCardInOrder: state.nextCardInOrder + 1,
        numberOfCards: state.numberOfCards - 1,
      };
    }
    case 'SET_GAME_OVER':
      return { ...state, isGameOver: true, winner: action.winner };
    case 'SET_TOTAL_BET':
      return { ...state, totalBet: action.value };
    case 'SET_STOP_CLICKED':
      return { ...state, stopClicked: true };
    case 'SET_ENOUGH_REACHED':
      return { ...state, enoughReached: true };
    case 'SET_PLAYER_BALANCE':
      return { ...state, playerBalance: action.value };
    case 'SET_DEALER_BALANCE':
      return { ...state, dealerBalance: action.value };
    case 'SET_BET_SUBMIT_CLICKED':
      return { ...state, betSubmitClicked: action.value };
    default:
      return state;
  }
}

const GameContext = createContext();

export function GameProvider({ children }) {
  const { user, setUser } = useUser();

  // Only initialize balances from user at mount time, not on every render
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    playerBalance: user?.creditBalance ?? 100,
    dealerBalance: initialState.dealerBalance,
  });

  const yourHandValue = handValue(state.yourHand);
  const dealerHandValue = handValue(state.dealerHand);

  const [showBetInput, setShowBetInput] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  // --- ACTION DISPATCHER functions ---
  const addPlayerCard = (card) => dispatch({ type: 'ADD_PLAYER_CARD', card });
  const addDealerCard = (card) => dispatch({ type: 'ADD_DEALER_CARD', card });
  const setStopClicked = () => dispatch({ type: 'SET_STOP_CLICKED' });
  const setEnoughReached = () => dispatch({ type: 'SET_ENOUGH_REACHED' });
  const setGameOver = (winner) => dispatch({ type: 'SET_GAME_OVER', winner });
  const setPlayerBalance = (value) => dispatch({ type: 'SET_PLAYER_BALANCE', value });
  const setDealerBalance = (value) => dispatch({ type: 'SET_DEALER_BALANCE', value });
  const setTotalBet = (value) => dispatch({ type: 'SET_TOTAL_BET', value });
  const setBetSubmitClicked = (value) => dispatch({ type: 'SET_BET_SUBMIT_CLICKED', value });

  // --- Always get player balance from backend on reset ---
  const resetGame = async () => {
    console.log('resetGame called');
    const token = localStorage.getItem('jwtToken');
    let latestCredit = 100;
    try {
      const res = await fetch('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const latestUser = await res.json();
        setUser(latestUser); // normalization happens in context
        latestCredit = latestUser.creditBalance ?? latestUser.playerBalance ?? 100;
      }
    } catch (err) {
      console.error('Error resetting game:', err);
    }
    // Keep dealer balance independent; only sync to player's balance if dealer is broke
    let newDealerBalance = state.dealerBalance;
    if (newDealerBalance <= 0) {
      newDealerBalance = latestCredit;
    }
    dispatch({
      type: 'RESET_GAME',
      playerBalance: latestCredit,
      dealerBalance: newDealerBalance,
    });
    setShowBetInput(false);
    setBetAmount('');
  };

  // --- BUTTONS LOGIC ---
  const handleRaiseBetClick = () => {
    setShowBetInput(true);
    setBetAmount('');
  };

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  const handleChange = (e) => {
    const val = e.target.value;
    if (val === '') {
      setBetAmount('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num <= state.playerBalance) {
      setBetAmount(val);
    } else if (num > state.playerBalance) {
      alert(`You cannot bet more than ${state.playerBalance}$`);
    }
  };

  const handlePlaceBet = (e) => {
    e.preventDefault();
    const numBet = parseInt(betAmount, 10);
    if (numBet > 0 && numBet <= state.playerBalance) {
      setTotalBet(state.totalBet + numBet * 2);
      setDealerBalance(state.dealerBalance - numBet);
      setPlayerBalance(state.playerBalance - numBet);
      setBetSubmitClicked(true);
      setShowBetInput(false);
      setBetAmount('');
    } else {
      alert('Enter a valid bet amount.');
    }
  };

  // --- SHOW/HIDE LOGIC ---
  const showMoreBtn = !state.stopClicked && yourHandValue < 20 && !showBetInput;
  const showRaiseBetBtn = !state.stopClicked && !showBetInput && !state.betSubmitClicked && yourHandValue < 20;
  const showEnoughBtn =
    !state.stopClicked &&
    yourHandValue >= 15 &&
    yourHandValue < 22 &&
    !(yourHandValue === 22 && state.yourHand.length === 2) &&
    !showBetInput &&
    !state.betSubmitClicked;
  const showHelpBtn = !showBetInput;

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        yourHandValue,
        dealerHandValue,
        showBetInput,
        setShowBetInput,
        betAmount,
        setBetAmount,
        handleRaiseBetClick,
        handleChange,
        handlePlaceBet,
        showMoreBtn,
        showRaiseBetBtn,
        showEnoughBtn,
        showHelpBtn,
        user,
        setUser,
        resetGame,
        addPlayerCard,
        addDealerCard,
        setStopClicked,
        setEnoughReached,
        setGameOver,
        setPlayerBalance,
        setDealerBalance,
        setTotalBet,
        setBetSubmitClicked,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}
