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
    <div className="end-game-controls">
      <h1 className="outcome-message">{outcomeMessage}</h1>

      <Link
        to="/startpage"
        state={{
          ...userData,
          Balance: playerBalance,
          dealerBalance: dealerBalance,
          Games: Games + 1,
          ...(winner === 'player' ? { Win: Win + 1 } : { Loss: Loss + 1 }),
        }}
      >
        <button className="new-game-button" onClick={handleNewGame} aria-label="Start a new game">
          New Game
        </button>
      </Link>

      <Link to="/">
        <button className="quit-button" onClick={handleQuit} aria-label="Quit and logout">
          Quit and Logout
        </button>
      </Link>
    </div>
  );
}

export default EndGameControls;
