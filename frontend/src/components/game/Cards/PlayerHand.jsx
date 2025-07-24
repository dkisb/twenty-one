import { useGame } from '../../../context/GameContext';
import { useUser } from '../../../context/UserContext';

function PlayerHand() {
  const { state, yourHandValue } = useGame();
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex gap-2 justify-center flex-wrap">
        {state.yourHand.map((card, index) => (
          <img
            key={index}
            src={card.frontImagePath}
            alt={`Card ${index + 1}`}
            className="player-card w-24 md:w-28 xl:w-32"
          />
        ))}
      </div>
      <p className="text-lg font-bold text-white">{user?.username || 'Player'}</p>
      <p className="text-lg font-semibold text-white">Value: {yourHandValue}</p>
    </div>
  );
}

export default PlayerHand;
