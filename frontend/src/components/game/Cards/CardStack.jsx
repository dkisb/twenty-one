import { useGame } from '../../../context/GameContext';

function CardStack() {
  const { state } = useGame();
  return (
    <div
      className="card-stack flex flex-col items-center justify-center text-center"
      aria-label={`Card stack with ${state.numberOfCards || 0} cards remaining`}
    >
      <img
        src="Back.jpg"
        alt={`Card stack with ${state.numberOfCards || 0} cards remaining`}
        className="max-h-[22vh] w-auto mx-1 shadow-xl rounded"
      />
      <p className="card-stack-text mt-2">
        <strong>
          {state.numberOfCards > 0
            ? `Card Stack (${state.numberOfCards} remaining)`
            : 'No cards remaining in the stack'}
        </strong>
      </p>
    </div>
  );
}
export default CardStack;
