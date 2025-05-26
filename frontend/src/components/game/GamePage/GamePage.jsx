import './GamePage.css';
import { useEffect } from 'react';
import Cards from "../Cards/Cards.jsx";
import DisplayBalances from '../utils/displaybalances';
import DisplayButtons from '../utils/displaybuttons';
import useGameStore from "../../../stores/gameStore.js";
import startStore from "../../../stores/startStore.js";

function GamePage({ onLoggedIn, onSuccessfulRegister, onActiveUser }) {
    const {
        yourHandValue,
        dealerHandValue,
        stopClicked,
        enoughClicked,
        setState,
        drawCard,
        playerBalance,
        dealerBalance,
        totalBet,
        betSubmitClicked,
    } = useGameStore();

    const {
        getCardIds,
        getCardData,
        getDealerBalance,
        getUserData,
        resetGame,
    } = startStore();

    useEffect(() => {
        // Initialize from startStore
        setState({
            randomCardIds: getCardIds(),
            dealerBalance: getDealerBalance(),
            playerBalance: getUserData()?.Balance || 100,
        });
    }, []);

    const handleMore = () => drawCard(true);
    const handleAiMore = () => drawCard(false);
    const handleStop = () => {
        setState({ stopClicked: true });
        drawCard(false);
    };

    return (
        <div className="game-page">
            <DisplayBalances
                dealerMax={dealerBalance}
                playerMax={playerBalance}
                currentTotal={totalBet}
                currentUser={getUserData()}
            />

            <Cards
                gameStarted={true}
                user={getUserData()}
                onLoggedIn={onLoggedIn}
                onSuccessfulRegister={onSuccessfulRegister}
                onActiveUser={onActiveUser}
            />

            <DisplayButtons
                dealerHandValue={dealerHandValue}
                stopClicked={stopClicked}
                enoughClicked={enoughClicked}
                onSetEnoughClicked={(val) => setState({ enoughClicked: val })}
                yourHandValue={yourHandValue}
                onHandleStop={handleStop}
                onHandleMore={handleMore}
                onHandleAiMore={handleAiMore}
                dealerMax={dealerBalance}
                playerMax={playerBalance}
                currentTotal={totalBet}
                onBet={(val) => setState({ totalBet: val })}
                onSetDealer={(val) => setState({ dealerBalance: val })}
                onSetPlayer={(val) => setState({ playerBalance: val })}
                betSubmitClicked={betSubmitClicked}
                onSubmitClicked={(val) => setState({ betSubmitClicked: val })}
            />
        </div>
    );
}

export default GamePage;
