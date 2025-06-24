import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GamePage from '../GamePage/GamePage';
import StartScreen from './StartScreen';

function StartPage({ onLoggedIn, onSuccessfulRegister, onActiveUser }) {
  const location = useLocation();
  const [gameStarted, setGameStarted] = useState(false);
  const [userData, setUserData] = useState({ _id: 1, Username: 'demo', Games: 0, Win: 0, Loss: 0 });

  useEffect(() => {
    const loggedInUser = location.state;
    if (loggedInUser) {
      setUserData(loggedInUser);
    }
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

  return gameStarted ? (
    <GamePage
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
      user={userData}
      onUser={setUserData}
      onLoggedIn={onLoggedIn}
      onSuccessfulRegister={onSuccessfulRegister}
      onActiveUser={onActiveUser}
    />
  ) : (
    <StartScreen userData={userData} onStart={handleStartGame} />
  );
}

export default StartPage;
