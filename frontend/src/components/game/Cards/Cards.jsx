import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../../context/GameContext';
import { useUser } from '../../../context/UserContext';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import DisplayBalances from './DisplayBalances';
import DisplayButtons from './DisplayButtons';
import EndGameControls from './EndGameControls';

function Cards() {
  const API_URL = import.meta.env.VITE_API_URL;
  const {
    state,
    yourHandValue,
    dealerHandValue,
    addPlayerCard,
    addDealerCard,
    setGameOver,
    setStopClicked,
    setEnoughReached,
    setPlayerBalance,
    setDealerBalance,
    setTotalBet,
    resetGame,
    setUser,
  } = useGame();
  const { user, logout } = useUser();

  const [outcomeMessage, setOutcomeMessage] = useState('');
  const modalRef = useRef(null);

  // Ref to skip outcome effect on initial render or after reset
  const skipOutcomeRef = useRef(true);

  // Set skipOutcomeRef to true after resetGame (new game)
  useEffect(() => {
    if (state.yourHand.length === 0 && state.dealerHand.length === 0) {
      skipOutcomeRef.current = true;
    }
  }, [state.yourHand.length, state.dealerHand.length]);

  // Effect: outcome check
  useEffect(() => {
    if (skipOutcomeRef.current) {
      skipOutcomeRef.current = false;
      return;
    }

    let gameOver = false;
    if (dealerHandValue >= 22 && state.dealerHand.length > 2) {
      setGameOver('player');
      setOutcomeMessage('Congratulation, you won!');
      gameOver = true;
    } else if (state.enoughReached && dealerHandValue === 22 && state.dealerHand.length === 2) {
      setGameOver('dealer');
      setOutcomeMessage('FIRE! Sorry, you lost!');
      gameOver = true;
    } else if (state.enoughReached && dealerHandValue >= yourHandValue && dealerHandValue < 22) {
      setGameOver('dealer');
      setOutcomeMessage('Sorry, you lost!');
      gameOver = true;
    } else if (state.enoughReached && dealerHandValue < yourHandValue) {
      setGameOver('player');
      setOutcomeMessage('Congratulation, you won!');
      gameOver = true;
    } else if (yourHandValue >= 22 && state.yourHand.length > 2) {
      setGameOver('dealer');
      setOutcomeMessage('Sorry, you lost!');
      gameOver = true;
    } else if (yourHandValue === 22 && state.yourHand.length === 2) {
      setGameOver('player');
      setOutcomeMessage('FIRE! Congratulation, you won!');
      gameOver = true;
    }
    if (gameOver && modalRef.current) {
      setTimeout(() => {
        modalRef.current.showModal();
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerHandValue, state.dealerHand.length, state.enoughReached, yourHandValue, state.yourHand.length]);

  // Effect: update user stats and balance when game ends
  useEffect(() => {
    if (!state.winner || !user) return;

    const updateUserStats = async () => {
      const addGame = 1;
      const addWin = state.winner === 'player' ? 1 : 0;
      const addLose = state.winner === 'dealer' ? 1 : 0;
      const addWinnings =
        state.winner === 'player' ? (state.totalBet / 2) : state.winner === 'dealer' ? -(state.totalBet / 2) : 0;
      const token = localStorage.getItem('jwtToken');
      const updatePayload = { addGame, addWin, addLose, addWinnings };

      // First, send PUT
      const putRes = await fetch(`${API_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });
      if (!putRes.ok) throw new Error('Failed to update user');

      // Only after PUT succeeds, fetch updated user
      const getRes = await fetch(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!getRes.ok) throw new Error('Failed to fetch updated user');
      const updatedUser = await getRes.json();
      setUser(updatedUser); // normalization in UserContext
    };

    updateUserStats().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.winner]);

  // Effect: handle winner/balances (for local state, but backend is source of truth)
  useEffect(() => {
    if (!state.winner) return;
    if (state.winner === 'player') {
      setPlayerBalance(state.playerBalance + state.totalBet);
      setTotalBet(0);
    } else if (state.winner === 'dealer') {
      setDealerBalance(state.dealerBalance + state.totalBet);
      setTotalBet(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.winner]);

  async function handleMore() {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`${API_URL}/api/shuffle/getnext?order=${state.nextCardInOrder}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`An error occurred while pulling the card: ${response.status}`);
      }

      const cardData = await response.json();
      addPlayerCard(cardData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('An error occurred while pulling the next card:', error);
    }
  }

  async function dealDealerCardsUntilThreshold(startingOrder, delay, threshold, initialHandValue) {
    const token = localStorage.getItem('jwtToken');
    let currentOrder = startingOrder;
    let currentHandValue = initialHandValue;
    while (currentHandValue < threshold) {
      const response = await fetch(`${API_URL}/api/shuffle/getnext?order=${currentOrder}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const cardData = await response.json();
      addDealerCard(cardData);
      currentHandValue += cardData.value;
      currentOrder++;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    if (currentHandValue >= threshold) {
      setEnoughReached();
    }
  }

  async function handleStop() {
    setStopClicked();
    await dealDealerCardsUntilThreshold(state.nextCardInOrder, 1000, 15, dealerHandValue);
  }

  async function handleNewGame() {
    const token = localStorage.getItem('jwtToken');
    const newShuffle = await fetch(`${API_URL}/api/shuffle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!newShuffle.ok) {
      throw new Error('Failed to start a new shuffle');
    }
    await resetGame();
    if (modalRef.current) modalRef.current.close();
  }

  async function handleQuit() {
    await resetGame();
    const result = logout();
    if (result instanceof Promise) {
      await result;
    }
    window.location.href = `/`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl relative text-white px-6 sm:px-8">
          {/* Left side: Balances */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <DisplayBalances />
          </div>
          {/* Top center: Dealer hand */}
          <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2">
            <DealerHand />
          </div>
          {/* Bottom center: Player hand */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <PlayerHand />
          </div>
          {/* Right side: Card stack */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <CardStack />
          </div>
          {/* Bottom right: Buttons */}
          <div className="absolute bottom-6 right-6">
            <DisplayButtons onHandleMore={handleMore} onHandleStop={handleStop} />
          </div>
        </div>
      </div>
      <EndGameControls
        ref={modalRef}
        outcomeMessage={outcomeMessage}
        handleNewGame={handleNewGame}
        handleQuit={handleQuit}
      />
    </div>
  );
}

export default Cards;
