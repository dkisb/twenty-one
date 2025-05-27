import { useEffect, useState } from 'react';
import PlayerHand from './PlayerHand';
import DealerHand from './DealerHand';
import CardStack from './CardStack';
import EndGameControls from './EndGameControls';
import useGameStore from '../../../stores/gameStore';

function Cards({ gameStarted, user, onLoggedIn, onSuccessfulRegister, onActiveUser }) {
  const {
    yourHand,
    dealerHand,
    yourHandData,
    dealerHandData,
    yourHandValue,
    dealerHandValue,
    stopClicked,
    enoughClicked,
    upperCardData,
    setState,
    randomCardIds,
    dealerBalance,
    playerBalance,
    totalBet,
    winner,
    isGameOver,
  } = useGameStore();

  const [outcomeMessage, setOutcomeMessage] = useState('');

  // Update hand value based on drawn card
  useEffect(() => {
    if (!upperCardData) return;
    setState((state) => ({
      ...(stopClicked
        ? { dealerHandValue: state.dealerHandValue + upperCardData.value }
        : { yourHandValue: state.yourHandValue + upperCardData.value }),
    }));
  }, [upperCardData]);

  // Game resolution logic
  useEffect(() => {
    if (!gameStarted) return;

    const win = (msg) => {
      setState({ winner: 'player', isGameOver: true });
      setOutcomeMessage(msg);
    };

    const lose = (msg) => {
      setState({ winner: 'dealer', isGameOver: true });
      setOutcomeMessage(msg);
    };

    if (yourHandValue >= 22 && yourHand.length > 2) return lose('You busted!');
    if (yourHandValue === 22 && yourHand.length === 2) return win('FIRE! You win!');
    if (dealerHandValue >= 22 && dealerHand.length > 2) return win('Dealer busted!');
    if (enoughClicked) {
      if (dealerHandValue === 22 && dealerHand.length === 2) return lose('FIRE! Dealer wins!');
      if (dealerHandValue >= yourHandValue && dealerHandValue < 22) return lose('Dealer wins!');
      if (dealerHandValue < yourHandValue) return win('You win!');
    }
  }, [yourHandValue, dealerHandValue, yourHand.length, dealerHand.length, enoughClicked]);

  return (
    <div>
      {!isGameOver ? (
        <>
          <DealerHand
            dealerHandData={dealerHandData}
            dealerHandValue={dealerHandValue}
            dealerHand={dealerHand}
            enoughClicked={enoughClicked}
          />
          <PlayerHand yourHandData={yourHandData} yourHandValue={yourHandValue} user={user} />
          <CardStack numberOfCards={randomCardIds.length} />
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
            userData={user}
            winner={winner}
            playerBalance={playerBalance}
            dealerBalance={dealerBalance}
          />
          <PlayerHand yourHandData={yourHandData} yourHandValue={yourHandValue} user={user} />
          <CardStack numberOfCards={randomCardIds.length} />
        </>
      )}
    </div>
  );
}

export default Cards;
