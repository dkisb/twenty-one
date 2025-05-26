import { Link } from 'react-router-dom';

function StartScreen({ userData, onStart }) {
    const handleHelpClick = () => {
        window.open('https://hu.wikipedia.org/wiki/Huszonegyes');
    };

    return (
        <>
            <div className="start-header">
                <h2>21 The Card Game</h2>
            </div>
            <div className="start-page">
                <button onClick={onStart} className="start-button">
                    Start Game
                </button>
                <div className="bottom-buttons">
                    <button onClick={handleHelpClick}>Rules</button>
                    <Link to="/account" state={userData}>
                        <button>Account</button>
                    </Link>
                    <button onClick={handleHelpClick}>Help</button>
                </div>
            </div>
        </>
    );
}

export default StartScreen;
