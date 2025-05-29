function DealerHand({ dealerHandData, dealerHand, dealerHandValue, enoughClicked }) {
  return (
    <div className="dealers-hand">
      {dealerHandData.map((item, index) => {
          console.log(item);
        const showFront = enoughClicked || (dealerHandValue > 21 && dealerHand.length > 2);
        const imageSrc = `${showFront ? item.frontImagePath : "Back.jpg"}`;
        const altText = showFront ? `Dealer card showing ${item.name}` : 'Card back';

        return (
          <img
            key={index}
            src={imageSrc}
            alt={altText}
            className={`dealer-card ${!showFront ? 'card-backside' : ''}`}
          />
        );
      })}
      <p>
        <strong>Dealer</strong>
      </p>
      {(enoughClicked || (dealerHandValue > 21 && dealerHand.length > 2)) && (
        <p>
          <strong>Value: {dealerHandValue}</strong>
        </p>
      )}
    </div>
  );
}

export default DealerHand;
