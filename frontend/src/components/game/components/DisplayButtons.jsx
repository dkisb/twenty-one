import { useGame } from '../../../context/GameContext/GameContext';

function DisplayButtons({ onHandleMore, onHandleStop }) {
  const {
    state,
    yourHandValue,
    showBetInput,
    handleRaiseBetClick,
    betAmount,
    handleChange,
    handlePlaceBet,
  } = useGame();

  const showMoreBtn =
    !state.stopClicked && yourHandValue < 20 && !showBetInput;
  const showRaiseBtn =
    !state.stopClicked &&
    !showBetInput &&
    !state.betSubmitClicked &&
    yourHandValue < 20;
  const showEnoughBtn =
    !state.stopClicked &&
    yourHandValue >= 15 &&
    yourHandValue < 22 &&
    !(yourHandValue === 22 && state.yourHand.length === 2) &&
    !showBetInput &&
    !state.betSubmitClicked;
  const showHelpBtn = !showBetInput;

  function openHelp() {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  }

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3">
      {/* Action Buttons Row */}
      <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 items-center">
        {showMoreBtn && (
          <button
            onClick={onHandleMore}
            className="btn btn-circle btn-primary btn-sm sm:btn-md md:btn-lg shadow-lg hover:scale-110 transition-transform"
            title="Draw More Card"
          >
            <span className="text-lg sm:text-xl md:text-2xl">🎴</span>
          </button>
        )}
        {showRaiseBtn && (
          <button
            onClick={handleRaiseBetClick}
            className="btn btn-circle btn-warning btn-sm sm:btn-md md:btn-lg shadow-lg hover:scale-110 transition-transform"
            title="Raise Bet"
          >
            <span className="text-lg sm:text-xl md:text-2xl">💰</span>
          </button>
        )}
        {showEnoughBtn && (
          <button
            onClick={onHandleStop}
            className="btn btn-circle btn-error btn-sm sm:btn-md md:btn-lg shadow-lg hover:scale-110 transition-transform"
            title="Stop - I Have Enough"
          >
            <span className="text-lg sm:text-xl md:text-2xl">🛑</span>
          </button>
        )}
        {showHelpBtn && (
          <button
            onClick={openHelp}
            className="btn btn-circle btn-accent btn-sm sm:btn-md md:btn-lg shadow-lg hover:scale-110 transition-transform"
            title="How to Play"
          >
            <span className="text-lg sm:text-xl md:text-2xl">❓</span>
          </button>
        )}
      </div>

      {/* Bet Input Form */}
      {showBetInput && (
        <form
          onSubmit={handlePlaceBet}
          className="flex flex-col gap-2 bg-white/20 p-3 rounded-xl shadow-lg backdrop-blur-lg border border-white/10"
        >
          <input
            type="number"
            placeholder="Enter bet"
            value={betAmount}
            onChange={handleChange}
            min="1"
            className="input input-bordered input-sm sm:input-md w-32 sm:w-40 text-black text-sm"
          />
          <button
            type="submit"
            className="btn btn-success btn-sm sm:btn-md font-bold"
          >
            ✅ Place Bet
          </button>
        </form>
      )}
    </div>
  );
}

export default DisplayButtons;