import { useState, useEffect } from 'react';
import Cards from '../Cards/Cards.jsx';
function GamePage({
  numberOfCards,
  onNumberOfCards,
  gameStarted,
  user,
  dealerMoney,
  onLoggedIn,
  onSuccessfulRegister,
  onActiveUser,
}) {
  const [yourHandLength, setYourHandLength] = useState(0);
  const [dealerHandLength, setDealerHandLength] = useState(0);
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
  const [nextCardInOrder, setNextCardInOrder] = useState(1);

  async function handleMore() {
    const response = await fetch(`/api/shuffle/getnext/1?order=${nextCardInOrder}`);
    const cardData = await response.json();
    setUpperCardData(cardData);
    setYourHandData([...yourHandData, cardData]);
    setBetSubmitClicked(false);
    setNextCardInOrder(nextCardInOrder + 1);
    onNumberOfCards(numberOfCards - 1);
    setYourHandLength(yourHandLength + 1);
  }

  async function handleAiMore() {
    const response = await fetch(`/api/shuffle/getnext/1?order=${nextCardInOrder}`);
    const cardData = await response.json();
    setUpperCardData(cardData);
    setDealerHandData([...dealerHandData, cardData]);
    setNextCardInOrder(nextCardInOrder + 1);
    onNumberOfCards(numberOfCards - 1);
    setDealerHandLength(dealerHandLength + 1);
  }

  async function handleStop() {
    setStopClicked(true);
    const response = await fetch(`/api/shuffle/getnext/1?order=${nextCardInOrder}`);
    const cardData = await response.json();
    setUpperCardData(cardData);
    setDealerHandData([...dealerHandData, cardData]);
    setDealerHandLength(dealerHandLength + 1)
    setNextCardInOrder(nextCardInOrder + 1);
    onNumberOfCards(numberOfCards - 1);
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
      <Cards
        yourHandValue={yourHandValue}
        numberOfCards={numberOfCards}
        dealerHandValue={dealerHandValue}
        stopClicked={stopClicked}
        enoughClicked={enoughClicked}
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
        onHandleAiMore={handleAiMore}
        onHandleStop={handleStop}
        onSetEnoughClicked={setEnoughClicked}
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
