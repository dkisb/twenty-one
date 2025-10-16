import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
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
    [dispatch]
  );

  const handleAddDealerCard = useCallback(
    (card) => dispatch(addDealerCard(card)),
    [dispatch]
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
        latestCredit = latestUser.playerBalance ?? latestUser.creditBalance ?? 100;
      }
    } catch (err) {
      console.error('Error resetting game:', err);
      toast.error('Failed to reset game. Please refresh the page');
    }

    const newDealerBalance = state.dealerBalance <= 0 ? 100 : state.dealerBalance;
    dispatch(resetGameAction(latestCredit, newDealerBalance));
    setShowBetInput(false);
    setBetAmount('');
  }, [API_URL, setUser, state.dealerBalance, dispatch]);

  const handleRaiseBetClick = useCallback(() => {
    setShowBetInput(true);
    setBetAmount('');
  }, []);

  // === use actual user balance instead of stale state value ===
  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      if (val === '') return setBetAmount('');

      const num = parseInt(val, 10);
      const currentBalance = user?.playerBalance ?? 0;

      if (!isNaN(num) && num <= currentBalance) {
        setBetAmount(val);
      } else if (num > currentBalance) {
        toast.error(`You cannot bet more than $${currentBalance}`);
      }
    },
    [user]
  );

  const handlePlaceBet = useCallback(
    (e) => {
      e.preventDefault();
      const numBet = parseInt(betAmount, 10);
      const currentBalance = user?.playerBalance ?? 0;

      // Additional safeguards against negative balance
      if (isNaN(numBet) || numBet <= 0) {
        toast.error('Please enter a valid bet amount greater than 0');
        return;
      }

      if (numBet > currentBalance) {
        toast.error(`Insufficient funds. You only have $${currentBalance} available`);
        return;
      }

      if (currentBalance <= 0) {
        toast.error('You have no funds available to bet');
        return;
      }

      // Calculate new balance and ensure it won't go negative
      const newPlayerBalance = currentBalance - numBet;
      if (newPlayerBalance < 0) {
        toast.error('This bet would result in a negative balance. Please bet less');
        return;
      }

      // update balances locally in game state
      dispatch(setTotalBet(state.totalBet + numBet * 2));
      dispatch(setDealerBalance(state.dealerBalance - numBet));
      dispatch(setPlayerBalance(newPlayerBalance));

      // update user context immediately
      setUser({
        ...user,
        playerBalance: newPlayerBalance,
      });

      dispatch(setBetSubmitClicked(true));
      setShowBetInput(false);
      setBetAmount('');
    },
    [betAmount, state, user, dispatch, setUser]
  );

  return {
    yourHandValue,
    dealerHandValue,
    showBetInput,
    setShowBetInput,
    betAmount,
    setBetAmount,
    addPlayerCard: handleAddPlayerCard,
    addDealerCard: handleAddDealerCard,
    handleRaiseBetClick,
    handleChange,
    handlePlaceBet,
    resetGame,
    setStopClicked: () => dispatch(setStopClicked()),
    setEnoughReached: () => dispatch(setEnoughReached()),
    setGameOver: (winner) => dispatch(setGameOver(winner)),
  };
}