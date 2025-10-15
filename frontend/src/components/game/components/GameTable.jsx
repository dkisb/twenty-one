import { useState, useRef } from 'react';
import { useGame } from '../../../context/GameContext/GameContext';
import { useDealerLogic } from '../hooks/useDealerLogic';
import { useOutcomeCheck } from '../hooks/useOutcomeCheck';
import { useDrawCard, useNewShuffle } from '../../api/shuffleApi';
import { useUser } from '../../../context/UserContext';

import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import DisplayBalances from './DisplayBalances';
import DisplayButtons from './DisplayButtons';
import EndGameControls from './EndGameControls';

function GameTable() {
  const {
    state,
    dealerHandValue,
    addPlayerCard,
    setStopClicked,
    resetGame,
  } = useGame();

  const { logout } = useUser();
  const drawCard = useDrawCard();
  const newShuffle = useNewShuffle();
  const { dealDealerCardsUntilThreshold } = useDealerLogic();

  const [outcomeMessage, setOutcomeMessage] = useState('');
  const modalRef = useRef(null);
  const { checkOutcome } = useOutcomeCheck(modalRef, setOutcomeMessage);

  async function handleMore() {
    const card = await drawCard.mutateAsync(state.nextCardInOrder);
    addPlayerCard(card);
  }

  async function handleStop() {
    setStopClicked();
    await dealDealerCardsUntilThreshold(state.nextCardInOrder, 1000, 15, dealerHandValue);
    checkOutcome();
  }

  async function handleNewGame() {
    await newShuffle.mutateAsync();
    await resetGame();
    modalRef.current?.close();
  }

  async function handleQuit() {
    await resetGame();
    await logout();
    window.location.href = '/';
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl relative text-white px-6 sm:px-8">
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <DisplayBalances />
          </div>
          <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2">
            <DealerHand />
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <PlayerHand />
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <CardStack />
          </div>
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

export default GameTable;