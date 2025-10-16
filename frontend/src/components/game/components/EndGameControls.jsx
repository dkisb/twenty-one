import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useUser } from '../../../context/UserContext';

const EndGameControls = forwardRef(function EndGameControlsModal(
  { outcomeMessage, handleNewGame, handleQuit },
  ref
) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => ({
    showModal: () => innerRef.current?.showModal(),
    close: () => innerRef.current?.close(),
  }));

  const { user } = useUser();
  const { playedGames, wonGames, lostGames } = user ?? {};

  return (
    <dialog
      ref={innerRef}
      className="modal bg-transparent"
      style={{ background: 'rgba(30, 41, 59, 0.35)' }}
    >
      <div className="modal-box glass bg-white/60 dark:bg-slate-800/80 shadow-2xl border border-white/20 backdrop-blur-lg px-4 py-6 sm:px-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-center mb-4 text-gray-900 dark:text-white">
          {outcomeMessage}
        </h1>

        {user && (
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-sm sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
            <span>Games: {playedGames}</span>
            <span className="text-green-600">Wins: {wonGames}</span>
            <span className="text-red-600">Losses: {lostGames}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
          <button
            onClick={handleNewGame}
            className="btn btn-success btn-sm sm:btn-lg font-bold w-full sm:w-auto"
          >
            🎮 New Game
          </button>
          <button
            onClick={handleQuit}
            className="btn btn-error btn-sm sm:btn-lg font-bold w-full sm:w-auto"
          >
            🚪 Quit & Logout
          </button>
        </div>
      </div>
    </dialog>
  );
});

export default EndGameControls;