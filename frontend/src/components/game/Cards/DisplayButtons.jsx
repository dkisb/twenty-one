import { useGame } from '../../../context/GameContext';

function DisplayButtons({ onHandleMore, onHandleStop }) {
  const {
    showBetInput,
    showMoreBtn,
    showRaiseBetBtn,
    showEnoughBtn,
    showHelpBtn,
    handleRaiseBetClick,
    betAmount,
    handleChange,
    handlePlaceBet,
  } = useGame();

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  };

  return (
    <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl shadow-lg flex flex-col gap-3 items-center min-w-[12rem] max-w-xs w-full border border-white/10">
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
      {showBetInput && (
        <form onSubmit={handlePlaceBet} className="flex flex-col gap-2 items-center w-full mt-2 animate-fade-in">
          <input
            type="number"
            placeholder="Enter your bet"
            value={betAmount}
            onChange={handleChange}
            min="1"
            className="input input-bordered input-sm w-full text-black"
            autoFocus
          />
          <button type="submit" className="btn btn-success btn-sm w-full font-bold tracking-wide">
            ✅ Place Bet
          </button>
        </form>
      )}
      {showHelpBtn && (
        <button onClick={handleHelpClick} className="btn btn-accent btn-xs w-full font-medium">
          ❓ How to Play
        </button>
      )}
    </div>
  );
}

export default DisplayButtons;
