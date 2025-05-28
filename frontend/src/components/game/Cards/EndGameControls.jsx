import React from 'react';
import PropTypes from 'prop-types';
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

EndGameControls.propTypes = {
  userData: PropTypes.shape({
    Games: PropTypes.number.isRequired,
    Win: PropTypes.number.isRequired,
    Loss: PropTypes.number.isRequired,
  }).isRequired,
  outcomeMessage: PropTypes.string.isRequired,
  winner: PropTypes.string.isRequired,
  playerBalance: PropTypes.number.isRequired,
  dealerBalance: PropTypes.number.isRequired,
  handleNewGame: PropTypes.func.isRequired,
  handleQuit: PropTypes.func.isRequired,
};

export default EndGameControls;
