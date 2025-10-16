import { useState, useRef } from 'react';
import { useGame } from '../../../context/GameContext/GameContext';
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
  const { state, addPlayerCard, setStopClicked, resetGame } = useGame();
  const { logout } = useUser();
  const drawCard = useDrawCard();
  const newShuffle = useNewShuffle();

  const [outcomeMessage, setOutcomeMessage] = useState('');
  const modalRef = useRef(null);
  const { dealAndCheckOutcome, checkPlayerBustImmediate } =
    useOutcomeCheck(modalRef, setOutcomeMessage);

  async function handleMore() {
    const card = await drawCard.mutateAsync(state.nextCardInOrder);
    addPlayerCard(card);
    const nextHand = [...state.yourHand, card];
    const total = nextHand.reduce((sum, c) => sum + c.value, 0);
    await checkPlayerBustImmediate(nextHand, total);
  }

  async function handleStop() {
    setStopClicked();
    await dealAndCheckOutcome();
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
    <div className="min-h-screen flex items-center justify-center bg-table-background px-2 sm:px-4 py-4 sm:py-8">
      <div className="p-2 sm:p-4 md:p-6 bg-[#4B2E1F] rounded-[40px] sm:rounded-[90px] shadow-inner w-full max-w-[90rem]">
        <div className="w-full aspect-[16/10] max-h-[85vh] bg-poker-table rounded-[30px] sm:rounded-[70px] shadow-2xl relative text-white overflow-hidden">
          
          {/* TOP LEFT — Dealer Balance */}
          <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 lg:left-10">
            <DisplayBalances type="dealer" />
          </div>

          {/* TOP CENTER — Dealer Hand */}
          <div className="absolute top-8 sm:top-12 md:top-14 lg:top-16 left-1/2 transform -translate-x-1/2">
            <DealerHand />
          </div>

          {/* MIDDLE LEFT — Total Pot */}
          <div className="absolute top-1/2 left-4 sm:left-6 md:left-8 lg:left-10 transform -translate-y-1/2">
            <DisplayBalances type="pot" />
          </div>

          {/* BOTTOM LEFT — Player Balance */}
          <div className="absolute bottom-8 sm:bottom-12 md:bottom-14 lg:bottom-16 left-4 sm:left-6 md:left-8 lg:left-10">
            <DisplayBalances type="player" />
          </div>

          {/* BOTTOM CENTER — Player Hand */}
          <div className="absolute bottom-8 sm:bottom-12 md:bottom-14 lg:bottom-16 left-1/2 transform -translate-x-1/2">
            <PlayerHand />
          </div>

          {/* RIGHT SIDE — Card Stack */}
          <div className="absolute top-1/2 right-2 sm:right-4 md:right-6 lg:right-8 transform -translate-y-1/2">
            <CardStack />
          </div>

          {/* BOTTOM RIGHT — Buttons */}
          <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 lg:right-8">
            <DisplayButtons
              onHandleMore={handleMore}
              onHandleStop={handleStop}
            />
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