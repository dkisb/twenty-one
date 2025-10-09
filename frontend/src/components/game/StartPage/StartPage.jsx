import {  useState } from 'react';
import GamePage from '../GamePage/GamePage';
import StartScreen from './StartScreen';

function StartPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [gameStarted, setGameStarted] = useState(false);
  
  const handleStartGame = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const newShuffle = await fetch(`${API_URL}/api/shuffle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
