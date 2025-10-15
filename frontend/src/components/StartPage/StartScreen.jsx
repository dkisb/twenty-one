import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function StartScreen({ onStart }) {
  const { user } = useUser();

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      {/* Poker Table Rim */}
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        {/* Green Felt Poker Table */}
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl overflow-hidden flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          {/* Decorative card image */}
          <img
            src="/hungarian-cards.png"
            alt="Hungarian Cards"
            className="absolute top-8 left-8 w-64 md:w-80 opacity-90 rotate-[-39deg] pointer-events-none"
          />

          {/* Decorative spinning chip */}
          <img
            src="/chips.png"
            alt="Poker Chips"
            className="animate-spin-once absolute bottom-8 right-8 w-48 md:w-64 opacity-100 pointer-events-none"
          />

          {/* Title */}
          <h2 className="text-5xl font-extrabold mb-16 drop-shadow-lg text-center">21 The Card Game</h2>

          {/* Start Button */}
          <button onClick={onStart} className="btn btn-lg bg-white text-black border-none mb-10">
            <span className="text-3xl font-bold">🎮 Let's play</span>
          </button>

          {/* Other Buttons */}
          <div className="flex flex-col items-center gap-6">
            <button onClick={handleHelpClick} className="btn btn-lg bg-white text-black border-none">
              <span className="text-2xl font-semibold">📖 Rules</span>
            </button>

            <Link to="/account" state={user}>
              <button className="btn btn-lg bg-white text-black border-none">
                <span className="text-2xl font-semibold">👤 Account</span>
              </button>
            </Link>

            <button onClick={handleHelpClick} className="btn btn-lg bg-white text-black border-none">
              <span className="text-2xl font-semibold">❓ Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
