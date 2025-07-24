import { useGame } from '../../../context/GameContext';

function DisplayBalances() {
  const { state, user } = useGame();

  return (
    <div className="balances-container">
      <div className="dealers-balance">
        <img src="/chips.png" width="125" alt="Dealer poker chips" />
        <p>
          <strong>Dealer's balance: {state.dealerBalance}$</strong>
        </p>
      </div>
      <div className="total-bet">
        <img src="/chips.png" width="125" alt="Total bet chips" />
        <p>
          <strong>Total: {state.totalBet}$</strong>
        </p>
      </div>
      <div className="players-balance">
        <img src="/chips.png" width="125" alt="Player poker chips" />
        <p>
          <strong>
            {user?.username || 'Player'}'s balance: {state.creditBalance}$
          </strong>
        </p>
      </div>
    </div>
  );
}

export default DisplayBalances;
