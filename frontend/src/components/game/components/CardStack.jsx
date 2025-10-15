import { useGame } from '../../../context/GameContext/GameContext';

function CardStack() {
  const { state } = useGame();
  const remaining = state.numberOfCards || 0;

  return (
    <div
      className="card-stack flex flex-col items-center justify-center text-center"
      aria-label={`Card stack with ${remaining} cards remaining`}
    >
      <img
        src="/Back.jpg"
        alt={`Card stack with ${remaining} cards remaining`}
        className="max-h-[22vh] w-auto mx-1 shadow-xl rounded"
      />
      <p className="mt-2 font-bold">
        {remaining > 0 ? `Card Stack (${remaining} remaining)` : 'No cards remaining'}
      </p>
    </div>
  );
}

export default CardStack;