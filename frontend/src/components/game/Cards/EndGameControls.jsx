import { Link } from 'react-router-dom';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useUser } from '../../../context/UserContext';

const EndGameControls = forwardRef(function EndGameControlsModal({ outcomeMessage, handleNewGame, handleQuit }, ref) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => ({
    showModal: () => innerRef.current?.showModal(),
    close: () => innerRef.current?.close(),
  }));

  const { user } = useUser();
  const { Games, Win, Loss } = user ?? {};

  return (
    <dialog ref={innerRef} className="modal bg-transparent" style={{ background: 'rgba(30, 41, 59, 0.35)' }}>
      <div className="modal-box glass bg-white/60 dark:bg-slate-800/80 shadow-2xl border border-white/20 backdrop-blur-lg transition-all">
        <h1 className="text-5xl font-extrabold text-center drop-shadow-sm text-gray-900 dark:text-white mb-4">
          {outcomeMessage}
        </h1>

        {user && (
          <div className="flex flex-row justify-center gap-6 mb-6 text-lg font-semibold text-gray-700 dark:text-gray-300">
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Games:</span> {Games}
            </div>
            <div>
              <span className="font-bold text-green-600">Wins:</span> {Win}
            </div>
            <div>
              <span className="font-bold text-red-600">Losses:</span> {Loss}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Link to="/gamepage" className="w-full sm:w-auto">
            <button
              className="btn btn-lg btn-success w-full sm:w-auto text-2xl font-bold shadow-md"
              onClick={handleNewGame}
              aria-label="Start a new game"
              type="button"
            >
              <span className="mr-2">🎮</span> New Game
            </button>
          </Link>

          <Link to="/" className="w-full sm:w-auto">
            <button
              className="btn btn-lg btn-error w-full text-2xl font-bold shadow-md"
              onClick={handleQuit}
              aria-label="Quit and logout"
              type="button"
            >
              <span className="mr-2">🚪</span> Quit &amp; Logout
            </button>
          </Link>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default bg-transparent"></button>
      </form>
    </dialog>
  );
});

export default EndGameControls;
