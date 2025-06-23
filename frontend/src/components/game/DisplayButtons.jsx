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
  const [betAmount, setBetAmount] = useState(''); // Default to empty string

  const handleRaiseBetClick = () => {
    setShowBetInput(true);
    setBetAmount(''); // Reset input to empty when opening bet input
  };

  const handleChange = (e) => {
    const val = e.target.value;
    // allow empty input
    if (val === '') {
      setBetAmount('');
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num) && num <= playerMax) {
      setBetAmount(val);
    } else if (num > playerMax) {
      alert(`You cannot bet more than ${playerMax}$`);
    }
  };

  const handlePlaceBet = (e) => {
    e.preventDefault();
    const numBet = parseInt(betAmount, 10);
    if (numBet > 0) {
      onBet(currentTotal + numBet * 2);
      onSetDealer(dealerMax - numBet);
      onSetPlayer(playerMax - numBet);
      onSubmitClicked(true);
      setShowBetInput(false);
      setBetAmount('');
    } else {
      alert('Enter a valid bet amount.');
    }
  };

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  };

  // Logic to hide/show buttons
  const showMoreBtn = !stopClicked && yourHandValue < 20 && !showBetInput;

  const showRaiseBetBtn = !stopClicked && !showBetInput && !betSubmitClicked && yourHandValue < 20;

  const showEnoughBtn =
    !stopClicked &&
    yourHandValue >= 15 &&
    yourHandValue < 22 &&
    !(yourHandValue === 22 && yourHandLength === 2) &&
    !showBetInput &&
    !betSubmitClicked;

  const showHelpBtn = !showBetInput;

  return (
    <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-lg flex flex-col gap-3 items-center min-w-[12rem] max-w-xs w-full border border-white/10">
      {/* Action Buttons */}
      <div className="flex flex-col gap-2 w-full items-center">
        {showMoreBtn && (
          <button onClick={onHandleMore} className="btn btn-primary btn-sm w-full font-semibold tracking-wide">
            🔁 More
          </button>
        )}
        {showRaiseBetBtn && (
          <button onClick={handleRaiseBetClick} className="btn btn-warning btn-sm w-full font-semibold tracking-wide">
            💰 Raise Bet
          </button>
        )}
        {showEnoughBtn && (
          <button onClick={onHandleStop} className="btn btn-error btn-sm w-full font-semibold tracking-wide">
            ✋ Enough
          </button>
        )}
      </div>

      {/* Bet Input */}
      {showBetInput && (
        <form onSubmit={handlePlaceBet} className="flex flex-col gap-2 items-center w-full mt-2 animate-fade-in">
          <input
            type="number"
            placeholder="Enter your bet"
            value={betAmount}
            onChange={handleChange}
            max={playerMax}
            min="1"
            className="input input-bordered input-sm w-full text-black"
            autoFocus
          />
          <button type="submit" className="btn btn-success btn-sm w-full font-bold tracking-wide">
            ✅ Place Bet
          </button>
        </form>
      )}

      {/* Help Button */}
      {showHelpBtn && (
        <button onClick={handleHelpClick} className="btn btn-accent btn-xs w-full font-medium">
          ❓ How to Play
        </button>
      )}
    </div>
  );
}

export default DisplayButtons;
