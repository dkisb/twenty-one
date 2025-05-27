import { Link } from 'react-router-dom';

function StartScreen({ userData, onStart }) {
  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-oak-brown px-4 py-8">
      <div className="w-full max-w-[90rem] h-[42rem] bg-poker-table rounded-[80px] shadow-2xl overflow-hidden flex flex-col items-center justify-center relative text-white px-8">
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
        <button onClick={onStart} className="btn btn-lg btn-warning mb-10">
          <span className="text-3xl font-bold">🎮 Let's play</span>
        </button>

        {/* Other Buttons */}
        <div className="flex flex-col items-center gap-6">
          <button onClick={handleHelpClick} className="btn btn-lg btn-warning">
            <span className="text-2xl font-semibold">📖 Rules</span>
          </button>

          <Link to="/account" state={userData}>
            <button className="btn btn-lg btn-warning">
              <span className="text-2xl font-semibold">👤 Account</span>
            </button>
          </Link>

          <button onClick={handleHelpClick} className="btn btn-lg bg-orange-600 hover:bg-orange-700 text-white">
            <span className="text-2xl font-semibold">❓ Help</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
