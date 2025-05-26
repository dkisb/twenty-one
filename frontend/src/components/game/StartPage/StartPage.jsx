import './StartPage.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GamePage from '../GamePage/GamePage';
import StartScreen from './StartScreen';
import startStore from './startStore';

function StartPage({ onLoggedIn, onSuccessfulRegister, onActiveUser }) {
    const location = useLocation();
    const {
        gameStarted,
        startGame,
        getCardIds,
        getUserData,
        setUser,
        setDealerBalance,
    } = startStore();

    useEffect(() => {
        const loggedInUser = location.state;
        if (loggedInUser) {
            setUser(loggedInUser);
            setDealerBalance(loggedInUser.dealerBalance ?? 100);
        }
    }, [location.state]);

    const handleStartGame = async () => {
        await startGame(); // fetches and sets shuffled card IDs + first card
    };

    return gameStarted && getCardIds() ? (
        <GamePage
            randomCards={getCardIds()}
            gameStarted={gameStarted}
            user={getUserData()}
            dealerMoney={startStore.getState().getDealerBalance()}
            onLoggedIn={onLoggedIn}
            onSuccessfulRegister={onSuccessfulRegister}
            onActiveUser={onActiveUser}
        />
    ) : (
        <StartScreen userData={getUserData()} onStart={handleStartGame} />
    );
}

export default StartPage;
