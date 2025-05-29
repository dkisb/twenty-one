import { useEffect, useState } from 'react';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import EndGameControls from './EndGameControls';

function Cards({
  playerBalance,
  dealerBalance,
  numberOfCards,
  yourHand,
  dealerHand,
  upperCard,
  yourHandData,
  dealerHandData,
  onSetYourValue,
  yourHandValue,
  dealerHandValue,
  onSetDealerValue,
  stopClicked,
  enoughClicked,
  onSetWinner,
  setGameOver,
  onGameOver,
  gameStarted,
  user,
  winner,
  onLoggedIn,
  onSuccessfulRegister,
  onActiveUser,
}) {
  const [outcomeMessage, setOutcomeMessage] = useState('');
  const [userData, setUserData] = useState(user);

  // Handle card value calculation
  useEffect(() => {
    if (upperCard && !stopClicked) {
      onSetYourValue(yourHandValue + upperCard.value);
    } else if (upperCard && stopClicked) {
      onSetDealerValue(dealerHandValue + upperCard.value);
    }
  }, [upperCard]);

  // Game logic
  useEffect(() => {
    if (dealerHandValue >= 22 && dealerHand.length > 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
    } else if (enoughClicked && dealerHandValue === 22 && dealerHand.length === 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('FIRE! Sorry, you lost!');
    } else if (enoughClicked && dealerHandValue >= yourHandValue && dealerHandValue < 22) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
    } else if (enoughClicked && dealerHandValue < yourHandValue) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('Congratulation, you won!');
    } else if (yourHandValue >= 22 && yourHand.length > 2) {
      onSetWinner('dealer');
      setGameOver(true);
      setOutcomeMessage('Sorry, you lost!');
    } else if (yourHandValue === 22 && yourHand.length === 2) {
      onSetWinner('player');
      setGameOver(true);
      setOutcomeMessage('FIRE! Congratulation, you won!');
    }
  }, [
    dealerHandValue,
    dealerHand.length,
    enoughClicked,
    yourHandValue,
    yourHand.length,
    onSetWinner,
    setGameOver,
    onGameOver,
  ]);

  // PATCH user on end actions
  async function patchUser(id, update) {
    const response = await fetch(`/api/user/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    return await response.json();
  }

  async function handleNewGame() {
    setGameOver(true);
    gameStarted(false);
    const updated = await patchUser(userData._id, {
      Balance: playerBalance,
      Games: userData.Games + 1,
      ...(winner === 'player' ? { Win: userData.Win + 1 } : { Loss: userData.Loss + 1 }),
    });
    onLoggedIn(true);
    onSuccessfulRegister(true);
    onActiveUser(updated);
  }

  async function handleQuit() {
    setGameOver(true);
    gameStarted(false);
    const updated = await patchUser(userData._id, {
      Balance: playerBalance,
      Games: userData.Games + 1,
      ...(winner === 'player' ? { Win: userData.Win + 1 } : { Loss: userData.Loss + 1 }),
    });
    onLoggedIn(false);
    onSuccessfulRegister(false);
    onActiveUser(null);
  }

  return (
    <div>
      {!onGameOver ? (
        <>
          <DealerHand
            dealerHandData={dealerHandData}
            dealerHandValue={dealerHandValue}
            dealerHand={dealerHand}
            enoughClicked={enoughClicked}
          />
          <PlayerHand yourHandData={yourHandData} yourHandValue={yourHandValue} user={user} />
          <CardStack numberOfCards={numberOfCards} />
        </>
      ) : (
        <>
          <DealerHand
            dealerHandData={dealerHandData}
            dealerHandValue={dealerHandValue}
            dealerHand={dealerHand}
            enoughClicked={enoughClicked}
          />
          <EndGameControls
            outcomeMessage={outcomeMessage}
            userData={userData}
            winner={winner}
            playerBalance={playerBalance}
            dealerBalance={dealerBalance}
            handleNewGame={handleNewGame}
            handleQuit={handleQuit}
          />
          <PlayerHand yourHandData={yourHandData} yourHandValue={yourHandValue} user={user} />
          <CardStack numberOfCards={numberOfCards} />
        </>
      )}
    </div>
  );
}

export default Cards;
