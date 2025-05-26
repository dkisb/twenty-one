function DealerHand({ dealerHandData, dealerHand, dealerHandValue, enoughClicked }) {
    return (
        <div className="dealers-hand">
            {dealerHandData.map((item, index) => {
                const showFront = enoughClicked || (dealerHandValue > 21 && dealerHand.length > 2);
                return (
                    <img
                        key={index}
                        src={`http://localhost:3000${showFront ? item.frontImage : item.backImage}`}
                        alt={showFront ? 'Dealer card' : 'Card back'}
                        className={!showFront ? 'card-backside' : ''}
                    />
                );
            })}
            <p><strong>Dealer</strong></p>
            {(enoughClicked || (dealerHandValue > 21 && dealerHand.length > 2)) && (
                <p><strong>Value: {dealerHandValue}</strong></p>
            )}
        </div>
    );
}

export default DealerHand;
