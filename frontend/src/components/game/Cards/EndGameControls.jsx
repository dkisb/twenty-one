import { Link } from 'react-router-dom';

function EndGameControls({ userData, outcomeMessage, winner, playerBalance, dealerBalance, handleNewGame, handleQuit }) {
    return (
        <div className="endGameNavBTNs">
            <h1>{outcomeMessage}</h1>

            <Link
                to="/startpage"
                state={{
                    ...userData,
                    Balance: playerBalance,
                    dealerBalance: dealerBalance,
                    Games: userData.Games + 1,
                    ...(winner === 'player'
                        ? { Win: userData.Win + 1 }
                        : { Loss: userData.Loss + 1 }),
                }}
            >
                <button onClick={handleNewGame}>New Game</button>
            </Link>

            <Link to="/">
                <button onClick={handleQuit}>Quit and Logout</button>
            </Link>
        </div>
    );
}

export default EndGameControls;
