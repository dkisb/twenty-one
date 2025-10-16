import { useGame } from '../../../context/GameContext/GameContext';
import { useUser } from '../../../context/UserContext';

function DisplayBalances() {
  const { state } = useGame();
  const { user } = useUser();

  return (
    <div className="balances-container">
      <div className="dealers-balance text-center mb-4">
        <img src="/chips.png" width="125" alt="Dealer poker chips" />
        <p><strong>Dealer's balance: {state.dealerBalance}$</strong></p>
      </div>

      <div className="total-bet text-center mb-4">
        <img src="/chips.png" width="125" alt="Total bet chips" />
        <p><strong>Total: {state.totalBet}$</strong></p>
      </div>

      <div className="players-balance text-center">
        <img src="/chips.png" width="125" alt="Player poker chips" />
        <p>
          <strong>
            {user?.username || 'Player'}'s balance: {user.playerBalance ?? 0}$
          </strong>
        </p>
      </div>
    </div>
  );
}

export default DisplayBalances;