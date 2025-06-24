import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../../context/UserContext';
import GamePage from '../GamePage/GamePage';
import StartScreen from './StartScreen';

function StartPage() {
  const location = useLocation();
  const [gameStarted, setGameStarted] = useState(false);
  const { user, setUser } = useUser();

  useEffect(() => {
    const loggedInUser = location.state;
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    // else setUser({ _id: 1, Username: 'demo', Games: 0, Win: 0, Loss: 0 });
    // Ha mindig demóval akarod, ne töröld ezt a sort.
    // eslint-disable-next-line
  }, [location.state]);

  const handleStartGame = async () => {
    try {
      const newShuffle = await fetch('/api/shuffle/1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!newShuffle.ok) {
        throw new Error('Failed to start a new shuffle');
      }
      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return gameStarted ? <GamePage /> : <StartScreen onStart={handleStartGame} />;
}

export default StartPage;
