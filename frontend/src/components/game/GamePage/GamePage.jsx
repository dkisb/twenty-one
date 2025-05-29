import { useState, useEffect } from 'react';
import DisplayBalances from '../utils/displaybalances';
import Cards from '../Cards/Cards.jsx';
import DisplayButtons from '../DisplayButtons.jsx';

function GamePage({ randomCards, gameStarted, user, dealerMoney, onLoggedIn, onSuccessfulRegister, onActiveUser }) {
  const [yourHand, setYourHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [randomCardIds, setRandomCardIds] = useState(randomCards);
  const [upperCardData, setUpperCardData] = useState(null);
  const [yourHandData, setYourHandData] = useState([]);
  const [dealerHandData, setDealerHandData] = useState([]);
  const [yourHandValue, setYourHandValue] = useState(0);
  const [dealerHandValue, setDealerHandValue] = useState(0);
  const [stopClicked, setStopClicked] = useState(false);
  const [enoughClicked, setEnoughClicked] = useState(false);
  const [dealerBalance, setDealerBalance] = useState(dealerMoney ?? 100);
  const [playerBalance, setPlayerBalance] = useState(user?.Balance ?? 100);
  const [totalBet, setTotalBet] = useState(0);
  const [winner, setWinner] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [betSubmitClicked, setBetSubmitClicked] = useState(false);

  async function handleMore() {
    setYourHand([...yourHand, randomCardIds[0]]);
    const nextCardId = randomCardIds[1];
    setRandomCardIds((prev) => prev.slice(1));

    if (nextCardId) {
      const response = await fetch(`/api/cards/${nextCardId}`);
      const cardData = await response.json();
      setUpperCardData(cardData);
      setYourHandData([...yourHandData, cardData]);
    }

    setBetSubmitClicked(false);
  }

  async function handleAiMore() {
    setDealerHand([...dealerHand, randomCardIds[0]]);
    const nextCardId = randomCardIds[1];
    setRandomCardIds((prev) => prev.slice(1));

    if (nextCardId) {
      const response = await fetch(`/api/cards/${nextCardId}`);
      const cardData = await response.json();
      setUpperCardData(cardData);
      setDealerHandData([...dealerHandData, cardData]);
    }
  }

  async function handleStop() {
    setStopClicked(true);
    setDealerHand([...dealerHand, randomCardIds[0]]);
    const nextCardId = randomCardIds[1];
    setRandomCardIds((prev) => prev.slice(1));

    if (nextCardId) {
      const response = await fetch(`/api/cards/${nextCardId}`);
      const cardData = await response.json();
      setUpperCardData(cardData);
      setDealerHandData([...dealerHandData, cardData]);
    }
  }

  useEffect(() => {
    if (winner === 'player') {
      setPlayerBalance(playerBalance + totalBet);
      setTotalBet(0);
    } else if (winner === 'dealer') {
      setDealerBalance(dealerBalance + totalBet);
      setTotalBet(0);
    }
  }, [isGameOver]);

  return (
    <div className="game-page">
      <DisplayBalances dealerMax={dealerBalance} playerMax={playerBalance} currentTotal={totalBet} currentUser={user} />

      <Cards
        yourHandValue={yourHandValue}
        dealerHandValue={dealerHandValue}
        stopClicked={stopClicked}
        enoughClicked={enoughClicked}
        onSetYourValue={setYourHandValue}
        onSetDealerValue={setDealerHandValue}
        card={randomCardIds[0]}
        upperCard={upperCardData}
        numberOfCards={randomCardIds.length}
        yourHand={yourHand}
        dealerHand={dealerHand}
        yourHandData={yourHandData}
        dealerHandData={dealerHandData}
        onSetWinner={setWinner}
        playerBalance={playerBalance}
        dealerBalance={dealerBalance}
        totalBet={totalBet}
        onPlayerBalance={setPlayerBalance}
        onDealerBalance={setDealerBalance}
        onTotalBet={setTotalBet}
        setGameOver={setIsGameOver}
        onGameOver={isGameOver}
        gameStarted={gameStarted}
        user={user}
        winner={winner}
        onLoggedIn={onLoggedIn}
        onSuccessfulRegister={onSuccessfulRegister}
        onActiveUser={onActiveUser}
      />

      <DisplayButtons
        dealerHandValue={dealerHandValue}
        dealerHand={dealerHand}
        stopClicked={stopClicked}
        enoughClicked={enoughClicked}
        onSetEnoughClicked={setEnoughClicked}
        yourHandValue={yourHandValue}
        onHandleStop={handleStop}
        onHandleMore={handleMore}
        onHandleAiMore={handleAiMore}
        dealerMax={dealerBalance}
        playerMax={playerBalance}
        currentTotal={totalBet}
        onBet={setTotalBet}
        onSetDealer={setDealerBalance}
        onSetPlayer={setPlayerBalance}
        betSubmitClicked={betSubmitClicked}
        onSubmitClicked={setBetSubmitClicked}
      />
    </div>
  );
}

export default GamePage;
