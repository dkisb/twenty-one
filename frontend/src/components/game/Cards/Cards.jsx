import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import DisplayBalances from '../DisplayBalances';
import DisplayButtons from '../DisplayButtons';

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

  useEffect(() => {
    if (dealerHandValue >= 22 && dealerHandLength > 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
    } else if (enoughReached && dealerHandValue === 22 && dealerHandLength === 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('FIRE! Sorry, you lost!');
    } else if (enoughReached && dealerHandValue >= yourHandValue && dealerHandValue < 22) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
    } else if (enoughReached && dealerHandValue < yourHandValue) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
    } else if (yourHandValue >= 22 && yourHandLength > 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
    } else if (yourHandValue === 22 && yourHandLength === 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('FIRE! Congratulation, you won!');
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
    navigate('/gamepage', { replace: true });
  }

  async function handleQuit() {
    setGameOver(true);
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

          {/* Game Over Screen */}
          {onGameOver && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-8 rounded-3xl bg-black bg-opacity-50 backdrop-blur-sm shadow-2xl border border-white/10 text-center space-y-6 w-[28rem] max-w-[90%]">
              <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.3)]">
                {outcomeMessage}
              </h1>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  className="btn btn-lg bg-white text-black border-none text-2xl font-bold w-full sm:w-auto"
                  onClick={handleNewGame}
                >
                  🎮 New Game
                </button>
                <button
                  className="btn btn-lg bg-white text-black border-none text-2xl font-bold w-full sm:w-auto"
                  onClick={handleQuit}
                >
                  🚪 Quit & Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cards;
