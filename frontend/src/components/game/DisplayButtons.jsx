import { useState } from 'react';

function DisplayButtons({
  onHandleMore,
  yourHandValue,
  dealerHandValue,
  yourHandLength,
  dealerHandLength,
  onHandleStop,
  stopClicked,
  enoughReached,
  onBet,
  onSetDealer,
  onSetPlayer,
  dealerMax,
  playerMax,
  currentTotal,
  betSubmitClicked,
  onSubmitClicked,
}) {
  const [showBetInput, setShowBetInput] = useState(false);
  const [betAmount, setBetAmount] = useState(0);

  const handleRaiseBetClick = () => {
    setShowBetInput(true);
  };

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val <= playerMax) {
      setBetAmount(val);
    } else if (val > playerMax) {
      alert(`You cannot bet more than ${playerMax}$`);
    }
  };

  const handlePlaceBet = (e) => {
    e.preventDefault();
    if (betAmount > 0) {
      onBet(currentTotal + betAmount * 2);
      onSetDealer(dealerMax - betAmount);
      onSetPlayer(playerMax - betAmount);
      onSubmitClicked(true);
      setShowBetInput(false);
      setBetAmount(0);
    } else {
      alert('Enter a valid bet amount.');
    }
  };

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg p-4 rounded-3xl shadow-xl flex flex-col gap-4 items-center min-w-[16rem]">
      <div className="flex flex-col gap-3 w-full items-center">
        {!stopClicked && yourHandValue < 20 && (
          <>
            <button onClick={onHandleMore} className="btn btn-primary w-full text-xl font-semibold">
              🔁 More
            </button>
            <button onClick={handleRaiseBetClick} className="btn btn-warning w-full text-xl font-semibold">
              💰 Raise Bet
            </button>
          </>
        )}

        {!stopClicked &&
          yourHandValue >= 15 &&
          yourHandValue < 22 &&
          !(yourHandValue === 22 && yourHandLength === 2) &&
          !betSubmitClicked && (
            <button onClick={onHandleStop} className="btn btn-error w-full text-xl font-semibold">
              ✋ Enough
            </button>
          )}
      </div>

      {showBetInput && (
        <form onSubmit={handlePlaceBet} className="flex flex-col gap-2 items-center mt-2 w-full">
          <input
            type="number"
            placeholder="Enter your bet"
            value={betAmount}
            onChange={handleChange}
            max={playerMax}
            min="1"
            className="input input-bordered w-full text-black"
          />
          <button type="submit" className="btn btn-success w-full font-bold">
            ✅ Place Bet
          </button>
        </form>
      )}

      <button onClick={handleHelpClick} className="btn btn-accent w-full text-lg font-medium mt-2">
        ❓ How to Play
      </button>
    </div>
  );
}

export default DisplayButtons;
