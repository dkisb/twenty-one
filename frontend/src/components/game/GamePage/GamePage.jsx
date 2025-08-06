import { useGame } from '../../../context/GameContext';
import Cards from '../Cards/Cards';
import React from 'react';

function GamePage() {
  const { resetGame } = useGame();

  React.useEffect(() => {
    resetGame();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="game-page">
      <Cards />
    </div>
  );
}

export default GamePage;
