import { useGame } from '../../../context/GameContext/GameContext';

function DealerHand() {
  const { state, dealerHandValue } = useGame();
  const { enoughReached, isGameOver, dealerHand } = state;
  const shouldShow =
    enoughReached || isGameOver || (dealerHandValue > 21 && dealerHand.length > 2);

  return (
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 text-center">
      <div className="flex gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 xl:gap-2.5 flex-wrap justify-center max-w-full">
        {dealerHand.map((card, i) => {
          const showFront = shouldShow;
          const src = showFront ? card.frontImagePath : 'Back.jpg';
          const alt = showFront ? `Dealer card showing ${card.name}` : 'Card back';
          return (
            <img
              key={i}
              src={src}
              alt={alt}
              className="dealer-card w-10 sm:w-12 md:w-14 lg:w-16 xl:w-20 2xl:w-24 h-auto shadow-lg rounded"
            />
          );
        })}
      </div>
      <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold text-white mt-0.5 sm:mt-1 leading-tight">
        Dealer's Cards
      </p>
      {shouldShow && (
        <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-white leading-tight">Value: {dealerHandValue}</p>
      )}
    </div>
  );
}

export default DealerHand;