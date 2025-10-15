import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../api/userApi';
import { useNewShuffle } from '../api/shuffleApi';
import GameTable from '../game/components/GameTable';
import Spinner from '../common/Spinner';
import ErrorPage from '../common/ErrorPage';

function StartPage() {
  const { data: user, isLoading, isError, error } = useUserProfile();
  const newShuffle = useNewShuffle();
  const [gameStarted, setGameStarted] = useState(false);

  const handleStartGame = async () => {
    try {
      await newShuffle.mutateAsync();
      setGameStarted(true);
    } catch (err) {
      console.error('Shuffle error:', err);
    }
  };

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorPage error={error} />;

  if (gameStarted) return <GameTable />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl overflow-hidden flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img
            src="/hungarian-cards.png"
            alt="Hungarian Cards"
            className="absolute top-8 left-8 w-64 md:w-80 opacity-90 rotate-[-39deg] pointer-events-none"
          />
          <img
            src="/chips.png"
            alt="Poker Chips"
            className="animate-spin-slow absolute bottom-8 right-8 w-48 md:w-64 opacity-100 pointer-events-none"
          />

          <h2 className="text-5xl font-extrabold mb-16 drop-shadow-lg text-center">
            21 The Card Game
          </h2>

          <button
            onClick={handleStartGame}
            disabled={newShuffle.isPending}
            className="btn btn-lg bg-white text-black border-none mb-10"
          >
            <span className="text-3xl font-bold">
              {newShuffle.isPending ? 'Shuffling...' : "🎮 Let's play"}
            </span>
          </button>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleHelpClick}
              className="btn btn-lg bg-white text-black border-none"
            >
              <span className="text-2xl font-semibold">📖 Rules</span>
            </button>

            <Link to="/account" state={user}>
              <button className="btn btn-lg bg-white text-black border-none">
                <span className="text-2xl font-semibold">👤 Account</span>
              </button>
            </Link>

            <button
              onClick={handleHelpClick}
              className="btn btn-lg bg-white text-black border-none"
            >
              <span className="text-2xl font-semibold">❓ Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;