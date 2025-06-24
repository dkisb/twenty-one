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
    setBetSubmitClicked,
  } = useGame();
  const { user, logout } = useUser();

  const [outcomeMessage, setOutcomeMessage] = useState('');
  const modalRef = useRef(null);

  // Effect: outcome check
  useEffect(() => {
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
    // eslint-disable-next-line
  }, [dealerHandValue, state.dealerHand.length, state.enoughReached, yourHandValue, state.yourHand.length]);

  // Effect: handle winner/balances
  useEffect(() => {
    if (!state.winner) return;
    if (state.winner === 'player') {
      setPlayerBalance(state.playerBalance + state.totalBet);
      setTotalBet(0);
    } else if (state.winner === 'dealer') {
      setDealerBalance(state.dealerBalance + state.totalBet);
      setTotalBet(0);
    }
    // eslint-disable-next-line
  }, [state.winner]);

  async function handleMore() {
    const response = await fetch(`/api/shuffle/getnext/1?order=${state.nextCardInOrder}`);
    const cardData = await response.json();
    addPlayerCard(cardData);
  }

  async function dealDealerCardsUntilThreshold(startingOrder, delay, threshold, initialHandValue) {
    let currentOrder = startingOrder;
    let currentHandValue = initialHandValue;
    while (currentHandValue < threshold) {
      const response = await fetch(`/api/shuffle/getnext/1?order=${currentOrder}`);
      const cardData = await response.json();
      addDealerCard(cardData);
      currentHandValue += cardData.value;
      currentOrder++;
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
    const newShuffle = await fetch('/api/shuffle/1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!newShuffle.ok) {
      throw new Error('Failed to start a new shuffle');
    }
    resetGame();
    if (modalRef.current) modalRef.current.close();
  }

  function handleQuit() {
    resetGame();
    if (modalRef.current) modalRef.current.close();
    logout();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl relative text-white px-6 sm:px-8">
          {/* Left side: Balances */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <DisplayBalances
              dealerMax={state.dealerBalance}
              playerMax={state.playerBalance}
              currentTotal={state.totalBet}
              currentUser={user}
            />
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
        userData={user}
        outcomeMessage={outcomeMessage}
        handleNewGame={handleNewGame}
        handleQuit={handleQuit}
      />
    </div>
  );
}

export default Cards;
