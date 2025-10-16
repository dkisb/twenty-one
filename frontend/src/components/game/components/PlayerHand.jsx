import { useGame } from '../../../context/GameContext/GameContext';
import { useUser } from '../../../context/UserContext';

function PlayerHand() {
  const { state, yourHandValue } = useGame();
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center">
      <div className="flex gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 justify-center flex-wrap max-w-full">
        {state.yourHand.map((card, i) => (
          <img
            key={i}
            src={card.frontImagePath}
            alt={`Card ${i + 1}`}
            className="player-card w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20 2xl:w-24 h-auto shadow-lg rounded"
          />
        ))}
      </div>
      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-white mt-0.5 sm:mt-1 leading-tight">
        {user?.username || 'Player'}'s Cards
      </p>
      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-white leading-tight">
        Value: {yourHandValue}
      </p>
    </div>
  );
}

export default PlayerHand;