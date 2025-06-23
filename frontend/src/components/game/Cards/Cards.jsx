import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import DisplayBalances from '../DisplayBalances';
import DisplayButtons from '../DisplayButtons';
import EndGameControls from './EndGameControls';

function Cards({
  playerBalance,
  dealerBalance,
  numberOfCards,
  yourHandLength,
  dealerHandLength,
  yourHandData,
  dealerHandData,
  yourHandValue,
  dealerHandValue,
  stopClicked,
  enoughReached,
  onSetWinner,
  setGameOver,
  onGameOver,
  user,
  onLoggedIn,
  onSuccessfulRegister,
  onActiveUser,
  onHandleMore,
  onHandleStop,
  onBet,
  onSetDealer,
  onSetPlayer,
  currentTotal,
  betSubmitClicked,
  onSubmitClicked,
}) {
  const [outcomeMessage, setOutcomeMessage] = useState('');
  const [userData, setUserData] = useState(user);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Detect game end and open modal
  useEffect(() => {
    let gameOver = false;
    if (dealerHandValue >= 22 && dealerHandLength > 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
      gameOver = true;
    } else if (enoughReached && dealerHandValue === 22 && dealerHandLength === 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('FIRE! Sorry, you lost!');
      gameOver = true;
    } else if (enoughReached && dealerHandValue >= yourHandValue && dealerHandValue < 22) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
      gameOver = true;
    } else if (enoughReached && dealerHandValue < yourHandValue) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
      gameOver = true;
    } else if (yourHandValue >= 22 && yourHandLength > 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
      gameOver = true;
    } else if (yourHandValue === 22 && yourHandLength === 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('FIRE! Congratulation, you won!');
      gameOver = true;
    }
    // Open modal on game over
    if (gameOver && modalRef.current) {
      setTimeout(() => {
        modalRef.current.showModal();
      }, 100);
    }
  }, [
    dealerHandValue,
    dealerHandLength,
    enoughReached,
    yourHandValue,
    yourHandLength,
    onSetWinner,
    setGameOver,
    onGameOver,
  ]);

  async function handleNewGame() {
    setGameOver(true);
    if (modalRef.current) modalRef.current.close();
    navigate('/gamepage', { replace: true });
  }

  async function handleQuit() {
    setGameOver(true);
    if (modalRef.current) modalRef.current.close();
    onLoggedIn(false);
    onSuccessfulRegister(false);
    onActiveUser(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl relative text-white px-6 sm:px-8">
          {/* Left side: Balances */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <DisplayBalances
              dealerMax={dealerBalance}
              playerMax={playerBalance}
              currentTotal={currentTotal}
              currentUser={userData}
            />
          </div>

          {/* Top center: Dealer hand */}
          <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2">
            <DealerHand
              dealerHandData={dealerHandData}
              dealerHandValue={dealerHandValue}
              dealerHandLength={dealerHandLength}
              enoughReached={enoughReached}
              gameOver={onGameOver}
            />
          </div>

          {/* Bottom center: Player hand */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <PlayerHand yourHandData={yourHandData} yourHandValue={yourHandValue} user={userData} />
          </div>

          {/* Right side: Card stack */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <CardStack numberOfCards={numberOfCards} />
          </div>

          {/* Bottom right: Buttons */}
          <div className="absolute bottom-6 right-6">
            <DisplayButtons
              onHandleMore={onHandleMore}
              yourHandValue={yourHandValue}
              dealerHandValue={dealerHandValue}
              yourHandLength={yourHandLength}
              dealerHandLength={dealerHandLength}
              onHandleStop={onHandleStop}
              stopClicked={stopClicked}
              enoughReached={enoughReached}
              onBet={onBet}
              onSetDealer={onSetDealer}
              onSetPlayer={onSetPlayer}
              dealerMax={dealerBalance}
              playerMax={playerBalance}
              currentTotal={currentTotal}
              betSubmitClicked={betSubmitClicked}
              onSubmitClicked={onSubmitClicked}
            />
          </div>
        </div>
      </div>
      {/* End Game Modal */}
      <EndGameControls
        ref={modalRef}
        userData={userData}
        outcomeMessage={outcomeMessage}
        handleNewGame={handleNewGame}
        handleQuit={handleQuit}
      />
    </div>
  );
}

export default Cards;
