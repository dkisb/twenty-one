import { useState, useCallback } from 'react';
import {
  addPlayerCard,
  addDealerCard,
  setStopClicked,
  setEnoughReached,
  setGameOver,
  setPlayerBalance,
  setDealerBalance,
  setTotalBet,
  setBetSubmitClicked,
  resetGame as resetGameAction,
} from './gameAction';
import { handValue } from './gameReducer';

export function useGameLogic(state, dispatch, user, setUser, API_URL) {
  const yourHandValue = handValue(state.yourHand);
  const dealerHandValue = handValue(state.dealerHand);

  const [showBetInput, setShowBetInput] = useState(false);
  const [betAmount, setBetAmount] = useState('');

  const handleAddPlayerCard = useCallback(
    (card) => dispatch(addPlayerCard(card)),
    [dispatch],
  );

  const handleAddDealerCard = useCallback(
    (card) => dispatch(addDealerCard(card)),
    [dispatch],
  );

  const resetGame = useCallback(async () => {
    const token = localStorage.getItem('jwtToken');
    let latestCredit = 100;

    try {
      const res = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const latestUser = await res.json();
        setUser(latestUser);
        latestCredit = latestUser.creditBalance ?? latestUser.playerBalance ?? 100;
      }
    } catch {
      console.error('Error resetting game');
    }

    let newDealerBalance = state.dealerBalance <= 0 ? 100 : state.dealerBalance;

    dispatch(resetGameAction(latestCredit, newDealerBalance));
    setShowBetInput(false);
    setBetAmount('');
  }, [API_URL, setUser, state.dealerBalance, dispatch]);

  const handleRaiseBetClick = useCallback(() => {
    setShowBetInput(true);
    setBetAmount('');
  }, []);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      if (val === '') return setBetAmount('');
      const num = parseInt(val, 10);
      if (!isNaN(num) && num <= state.playerBalance) setBetAmount(val);
      else if (num > state.playerBalance)
        alert(`You cannot bet more than ${state.playerBalance}$`);
    },
    [state.playerBalance],
  );

  const handlePlaceBet = useCallback(
    (e) => {
      e.preventDefault();
      const numBet = parseInt(betAmount, 10);
      if (numBet > 0 && numBet <= state.playerBalance) {
        dispatch(setTotalBet(state.totalBet + numBet * 2));
        dispatch(setDealerBalance(state.dealerBalance - numBet));
        dispatch(setPlayerBalance(state.playerBalance - numBet));
        dispatch(setBetSubmitClicked(true));
        setShowBetInput(false);
        setBetAmount('');
      } else {
        alert('Enter a valid bet amount.');
      }
    },
    [betAmount, state, dispatch],
  );

  return {
    yourHandValue,
    dealerHandValue,
    showBetInput,
    setShowBetInput,
    betAmount,
    setBetAmount,
    handleAddPlayerCard,
    handleAddDealerCard,
    handleRaiseBetClick,
    handleChange,
    handlePlaceBet,
    resetGame,
    setStopClicked: () => dispatch(setStopClicked()),
    setEnoughReached: () => dispatch(setEnoughReached()),
    setGameOver: (winner) => dispatch(setGameOver(winner)),
  };
}