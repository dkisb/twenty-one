import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GamePage from '../GamePage/GamePage';
import StartScreen from './StartScreen';

function StartPage({ onLoggedIn, onSuccessfulRegister, onActiveUser }) {
  const location = useLocation();
  const [gameStarted, setGameStarted] = useState(false);
  const [card, setCard] = useState(null); // preserved in case needed later
  const [randomCardIds, setRandomCardIds] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dealerBalance, setDealerBalance] = useState(100);

  useEffect(() => {
    const loggedInUser = location.state;
    if (loggedInUser) {
      setUserData(loggedInUser);
      setDealerBalance(loggedInUser.dealerBalance ?? 100);
    }
  }, [location.state]);

  const handleStartGame = async () => {
    try {
      const response = await fetch('/api/cards');
      const cardIds = await response.json();
      setRandomCardIds(cardIds);

      const cardId = cardIds[0];
      const response2 = await fetch(`/api/cards/${cardId}`);
      const cardData = await response2.json();
      setCard(cardData);

      setGameStarted(true);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  return gameStarted && randomCardIds ? (
    <GamePage
      randomCards={randomCardIds}
      gameStarted={gameStarted}
      user={userData}
      onUser={setUserData}
      dealerMoney={dealerBalance}
      onLoggedIn={onLoggedIn}
      onSuccessfulRegister={onSuccessfulRegister}
      onActiveUser={onActiveUser}
    />
  ) : (
    <StartScreen userData={userData} onStart={handleStartGame} />
  );
}

export default StartPage;
