import { useGame } from '../../../context/GameContext/GameContext';

function CardStack() {
  const { state } = useGame();
  const remaining = state.numberOfCards || 0;

  // scale card image size relative to remaining cards and viewport
  const scale =
    remaining > 35
      ? 1
      : remaining > 20
      ? 0.9
      : remaining > 10
      ? 0.8
      : remaining > 5
      ? 0.7
      : 0.6;

  return (
    <div
      className="
        card-stack flex flex-col items-center justify-start text-center
        w-full max-w-[120px] sm:max-w-[140px] md:max-w-[160px] lg:max-w-[180px] xl:max-w-[220px] 2xl:max-w-[250px]
        transition-transform duration-300 ease-in-out
      "
      aria-label={`Card stack with ${remaining} cards remaining`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
    >
      <img
        src="/Back.jpg"
        alt={`Card stack with ${remaining} cards remaining`}
        className="
          w-full h-auto
          max-h-[100px] sm:max-h-[120px] md:max-h-[140px] lg:max-h-[160px] xl:max-h-[200px] 2xl:max-h-[240px]
          mx-auto shadow-xl rounded-lg
        "
      />
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold whitespace-nowrap">
        {remaining > 0
          ? `${remaining} cards`
          : 'No cards'}
      </p>
    </div>
  );
}

export default CardStack;