import { useGame } from '../../../context/GameContext';

function DealerHand() {
  const { state, dealerHandValue } = useGame();
  const { enoughReached, isGameOver, dealerHand } = state;

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-lg font-bold text-white">Dealer</p>
      {(enoughReached || isGameOver || (dealerHandValue > 21 && dealerHand.length > 2)) && (
        <p className="text-lg font-semibold text-white">Value: {dealerHandValue}</p>
      )}
      <div className="flex gap-2 justify-center flex-wrap">
        {dealerHand.map((card, index) => {
          const showFront = enoughReached || isGameOver || (dealerHandValue > 21 && dealerHand.length > 2);
          const imageSrc = showFront ? card.frontImagePath : 'Back.jpg';
          const altText = showFront ? `Dealer card showing ${card.name}` : 'Card back';
          return <img key={index} src={imageSrc} alt={altText} className="dealer-card w-24 md:w-28 xl:w-32" />;
        })}
      </div>
    </div>
  );
}

export default DealerHand;
