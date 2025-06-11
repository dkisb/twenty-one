function DealerHand({ dealerHandData, dealerHandLength, dealerHandValue, enoughReached, gameOver }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <p className="text-lg font-bold text-white">Dealer</p>
      {(enoughReached || gameOver || (dealerHandValue > 21 && dealerHandLength > 2)) && (
        <p className="text-lg font-semibold text-white">Value: {dealerHandValue}</p>
      )}
      <div className="flex gap-2 justify-center flex-wrap">
        {dealerHandData.map((card, index) => {
          const showFront = enoughReached || gameOver || (dealerHandValue > 21 && dealerHandLength > 2);
          const imageSrc = showFront ? card.frontImagePath : 'Back.jpg';
          const altText = showFront ? `Dealer card showing ${card.name}` : 'Card back';
          return <img key={index} src={imageSrc} alt={altText} className="dealer-card w-24 md:w-28 xl:w-32" />;
        })}
      </div>
    </div>
  );
}

export default DealerHand;
