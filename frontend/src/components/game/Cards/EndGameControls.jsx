import { Link } from 'react-router-dom';

function EndGameControls({
  userData,
  outcomeMessage,
  winner,
  playerBalance,
  dealerBalance,
  handleNewGame,
  handleQuit,
}) {
  const { Games, Win, Loss } = userData;

  return (
    <div className="flex flex-col items-center justify-center mt-6 gap-6 text-white">
      <h1 className="text-5xl font-extrabold drop-shadow-md text-center">{outcomeMessage}</h1>

      <Link
        to="/"
        state={{
          ...userData,
          Balance: playerBalance,
          dealerBalance: dealerBalance,
          Games: Games + 1,
          ...(winner === 'player' ? { Win: Win + 1 } : { Loss: Loss + 1 }),
        }}
      >
        <button
          className="btn btn-lg bg-white text-black border-none"
          onClick={handleNewGame}
          aria-label="Start a new game"
        >
          <span className="text-3xl font-bold">🎮 New Game</span>
        </button>
      </Link>

      <Link to="/">
        <button
          className="btn btn-lg bg-white text-black border-none"
          onClick={handleQuit}
          aria-label="Quit and logout"
        >
          <span className="text-3xl font-bold">🚪 Quit & Logout</span>
        </button>
      </Link>
    </div>
  );
}

export default EndGameControls;
