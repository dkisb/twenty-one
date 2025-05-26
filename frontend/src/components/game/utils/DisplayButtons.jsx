import { useState } from 'react';

function DisplayButtons({
                            onHandleMore,
                            onHandleAiMore,
                            yourHandValue,
                            dealerHandValue,
                            stopClicked,
                            enoughClicked,
                            onSetEnoughClicked,
                            onHandleStop,
                            dealerMax,
                            playerMax,
                            currentTotal,
                            onBet,
                            onSetDealer,
                            onSetPlayer,
                            betSubmitClicked,
                            onSubmitClicked,
                        }) {
    const [showBetInput, setShowBetInput] = useState(false);
    const [betAmount, setBetAmount] = useState(0);

    const handleChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val <= playerMax) setBetAmount(val);
        else if (val > playerMax) alert(`You cannot bet more than ${playerMax}$`);
    };

    const handlePlaceBet = (e) => {
        e.preventDefault();
        if (betAmount > 0) {
            onBet(currentTotal + betAmount * 2);
            onSetDealer(dealerMax - betAmount);
            onSetPlayer(playerMax - betAmount);
            onSubmitClicked(true);
            setShowBetInput(false);
            setBetAmount(0);
        } else {
            alert('Enter a valid bet amount.');
        }
    };

    return (
        <div className="display-buttons">
            <div className="game-focused-buttons">
                {!stopClicked && yourHandValue < 20 && (
                    <>
                        <button onClick={onHandleMore}>More</button>
                        <button onClick={() => setShowBetInput(true)}>Raise Bet</button>
                    </>
                )}
                {!stopClicked &&
                    yourHandValue >= 15 &&
                    yourHandValue < 22 &&
                    !betSubmitClicked && (
                        <button onClick={onHandleStop}>Enough</button>
                    )}
            </div>

            {showBetInput && (
                <form onSubmit={handlePlaceBet} className="bet-input">
                    <input
                        type="number"
                        placeholder="Enter your bet"
                        value={betAmount}
                        onChange={handleChange}
                        max={playerMax}
                        min="1"
                    />
                    <button type="submit">Place Bet</button>
                </form>
            )}

            <div className="help-button">
                <button onClick={() => window.open('https://hu.wikipedia.org/wiki/Huszonegyes', '_blank')}>How to Play</button>
            </div>

            {stopClicked && dealerHandValue < 15 && (
                <div className="ai-more-button">
                    <button onClick={onHandleAiMore}>More</button>
                </div>
            )}

            {stopClicked &&
                ((dealerHandValue >= 15 && dealerHandValue <= 21) ||
                    (dealerHandValue === 22 && dealerHandValue.length === 2)) &&
                !enoughClicked && (
                    <div className="ai-enough-button">
                        <button onClick={() => onSetEnoughClicked(true)}>Enough</button>
                    </div>
                )}
        </div>
    );
}

export default DisplayButtons;
