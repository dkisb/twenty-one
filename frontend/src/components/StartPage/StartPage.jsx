import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
      toast.success('Game started! Good luck!');
    } catch (err) {
      console.error('Shuffle error:', err);
      toast.error('Failed to start game. Please try again');
    }
  };

  const handleHelpClick = () => {
    window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank');
  };

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorPage error={error} />;

  if (gameStarted) return <GameTable />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-2 sm:px-4 py-4 sm:py-8">
      <div className="p-2 sm:p-4 md:p-6 bg-[#4B2E1F] rounded-[40px] sm:rounded-[60px] md:rounded-[90px] shadow-inner w-full max-w-[90rem]">
        <div className="w-full aspect-[16/10] max-h-[85vh] bg-poker-table rounded-[30px] sm:rounded-[50px] md:rounded-[70px] shadow-2xl overflow-hidden flex flex-col items-center justify-center relative text-white px-3 sm:px-6 md:px-8 py-4">
          <img
            src="/hungarian-cards.png"
            alt="Hungarian Cards"
            className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 w-20 sm:w-32 md:w-48 lg:w-64 xl:w-80 opacity-90 rotate-[-39deg] pointer-events-none"
          />
          <img
            src="/chips.png"
            alt="Poker Chips"
            className="animate-spin-slow absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-8 w-16 sm:w-24 md:w-36 lg:w-48 xl:w-64 opacity-100 pointer-events-none"
          />

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-6 sm:mb-10 md:mb-14 lg:mb-16 drop-shadow-lg text-center">
            21 The Card Game
          </h2>

          <button
            onClick={handleStartGame}
            disabled={newShuffle.isPending}
            className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-white text-black border-none mb-3 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-10"
          >
            <span className="text-sm sm:text-base md:text-xl lg:text-2xl xl:text-3xl font-bold">
              {newShuffle.isPending ? 'Shuffling...' : "🎮 Let's play"}
            </span>
          </button>

          <div className="flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6">
            <button
              onClick={handleHelpClick}
              className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-white text-black border-none"
            >
              <span className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold">📖 Rules</span>
            </button>

            <Link to="/account" state={user}>
              <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-white text-black border-none">
                <span className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold">👤 Account</span>
              </button>
            </Link>

            <button
              onClick={handleHelpClick}
              className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-white text-black border-none"
            >
              <span className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-semibold">❓ Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;