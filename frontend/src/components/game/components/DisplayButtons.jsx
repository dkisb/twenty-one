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

  const showMoreBtn = !state.stopClicked && yourHandValue < 20 && !showBetInput;
  const showRaiseBtn = !state.stopClicked && !showBetInput && !state.betSubmitClicked && yourHandValue < 20;
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
    <div className="bg-white/20 p-3 rounded-2xl shadow-lg backdrop-blur-lg flex flex-col gap-3 items-center min-w-[12rem] max-w-xs border border-white/10">
      <div className="flex flex-col gap-2 w-full items-center">
        {showMoreBtn && (
          <button onClick={onHandleMore} className="btn btn-primary btn-sm w-full font-semibold">
            🔁 More
          </button>
        )}
        {showRaiseBtn && (
          <button onClick={handleRaiseBetClick} className="btn btn-warning btn-sm w-full font-semibold">
            💰 Raise Bet
          </button>
        )}
        {showEnoughBtn && (
          <button onClick={onHandleStop} className="btn btn-error btn-sm w-full font-semibold">
            ✋ Enough
          </button>
        )}
      </div>

      {showBetInput && (
        <form onSubmit={handlePlaceBet} className="flex flex-col gap-2 w-full">
          <input
            type="number"
            placeholder="Enter your bet"
            value={betAmount}
            onChange={handleChange}
            min="1"
            className="input input-bordered input-sm w-full text-black"
          />
          <button type="submit" className="btn btn-success btn-sm font-bold">
            ✅ Place Bet
          </button>
        </form>
      )}

      {showHelpBtn && (
        <button onClick={openHelp} className="btn btn-accent btn-xs w-full font-medium">
          ❓ How to Play
        </button>
      )}
    </div>
  );
}

export default DisplayButtons;