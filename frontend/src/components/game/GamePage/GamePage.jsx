import { useGame } from '../../../context/GameContext';
import { useUser } from '../../../context/UserContext';
import Cards from '../Cards/Cards';
import React from 'react';

function GamePage() {
  const { user } = useUser();
  const { resetGame, setPlayerBalance } = useGame();

  React.useEffect(() => {
    if (user && user.Balance != null) {
      setPlayerBalance(user.Balance);
    }
    resetGame();
    // eslint-disable-next-line
  }, [user]);

  return (
    <div className="game-page">
      <Cards />
    </div>
  );
}

export default GamePage;
