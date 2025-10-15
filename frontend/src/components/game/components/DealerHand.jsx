import { useGame } from '../../../context/GameContext';

function DealerHand() {
  const { state, dealerHandValue } = useGame();
  const { enoughReached, isGameOver, dealerHand } = state;
  const shouldShow = enoughReached || isGameOver || (dealerHandValue > 21 && dealerHand.length > 2);

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-lg font-bold text-white">Dealer</p>
      {shouldShow && (
        <p className="text-lg font-semibold text-white">Value: {dealerHandValue}</p>
      )}
      <div className="flex gap-2 justify-center flex-wrap">
        {dealerHand.map((card, i) => {
          const showFront = shouldShow;
          const src = showFront ? card.frontImagePath : 'Back.jpg';
          const alt = showFront ? `Dealer card showing ${card.name}` : 'Card back';
          return <img key={i} src={src} alt={alt} className="dealer-card w-24 md:w-28 xl:w-32" />;
        })}
      </div>
    </div>
  );
}

export default DealerHand;