import { useState, useEffect } from 'react';
import Cards from '../Cards/Cards.jsx';

function GamePage({ gameStarted, user, onLoggedIn, onSuccessfulRegister, onActiveUser }) {
  const [yourHandLength, setYourHandLength] = useState(0);
  const [dealerHandLength, setDealerHandLength] = useState(0);
  const [upperCardData, setUpperCardData] = useState(null);
  const [yourHandData, setYourHandData] = useState([]);
  const [dealerHandData, setDealerHandData] = useState([]);
  const [yourHandValue, setYourHandValue] = useState(0);
  const [dealerHandValue, setDealerHandValue] = useState(0);
  const [stopClicked, setStopClicked] = useState(false);
  const [enoughReached, setEnoughReached] = useState(false);
  const [dealerBalance, setDealerBalance] = useState(100);
  const [playerBalance, setPlayerBalance] = useState(user?.Balance ?? 100);
  const [numberOfCards, setNumberOfCards] = useState(32);
  const [totalBet, setTotalBet] = useState(0);
  const [winner, setWinner] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [betSubmitClicked, setBetSubmitClicked] = useState(false);
  const [nextCardInOrder, setNextCardInOrder] = useState(1);

  useEffect(() => {
    const handValue = dealerHandData.reduce((sum, card) => sum + card.value, 0);
    setDealerHandValue(handValue);
  }, [dealerHandData]);

  useEffect(() => {
    const handValue = yourHandData.reduce((sum, card) => sum + card.value, 0);
    setYourHandValue(handValue);
  }, [yourHandData]);

  async function handleMore() {
    const response = await fetch(`/api/shuffle/getnext/1?order=${nextCardInOrder}`);
    const cardData = await response.json();
    setUpperCardData(cardData);
    setYourHandData([...yourHandData, cardData]);
    setBetSubmitClicked(false);
    setNextCardInOrder(nextCardInOrder + 1);
    setNumberOfCards(numberOfCards - 1);
    setYourHandLength(yourHandLength + 1);
  }

  async function dealDealerCardsUntilThreshold(startingOrder, delay, threshold, initialHandValue) {
    let currentOrder = startingOrder;
    let currentHandValue = initialHandValue;

    while (currentHandValue < threshold) {
      const response = await fetch(`/api/shuffle/getnext/1?order=${currentOrder}`);
      const cardData = await response.json();
      setDealerHandData((prev) => [...prev, cardData]);
      setDealerHandLength((prev) => prev + 1);
      setNumberOfCards((prev) => prev - 1);
      currentHandValue += cardData.value;
      currentOrder++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    if (currentHandValue >= threshold) {
      setEnoughReached(true);
    }
  }

  async function handleStop() {
    setStopClicked(true);

    await dealDealerCardsUntilThreshold(nextCardInOrder, 1000, 15, dealerHandValue);
  }

  useEffect(() => {
    if (winner === 'player') {
      setPlayerBalance(playerBalance + totalBet);
      setTotalBet(0);
    } else if (winner === 'dealer') {
      setDealerBalance(dealerBalance + totalBet);
      setTotalBet(0);
    }
  }, [dealerBalance, isGameOver, playerBalance, totalBet, winner]);

  return (
    <div className="game-page">
      <Cards
        yourHandValue={yourHandValue}
        numberOfCards={numberOfCards}
        dealerHandValue={dealerHandValue}
        stopClicked={stopClicked}
        enoughReached={enoughReached}
        onSetYourValue={setYourHandValue}
        onSetDealerValue={setDealerHandValue}
        upperCard={upperCardData}
        yourHandLength={yourHandLength}
        dealerHandLength={dealerHandLength}
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
        onHandleMore={handleMore}
        onHandleStop={handleStop}
        onBet={setTotalBet}
        onSetDealer={setDealerBalance}
        onSetPlayer={setPlayerBalance}
        currentTotal={totalBet}
        betSubmitClicked={betSubmitClicked}
        onSubmitClicked={setBetSubmitClicked}
      />
    </div>
  );
}

export default GamePage;
