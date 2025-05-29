function DisplayBalances({ dealerMax, playerMax, currentTotal, currentUser }) {
  return (
    <div className="balances-container">
      <div className="dealers-balance">
        <img src="/chips.png" width="125" alt="Dealer poker chips" />
        <p>
          <strong>Dealer's balance: {dealerMax}$</strong>
        </p>
      </div>

      <div className="total-bet">
        <img src="/chips.png" width="125" alt="Total bet chips" />
        <p>
          <strong>Total: {currentTotal}$</strong>
        </p>
      </div>

      <div className="players-balance">
        <img src="/chips.png" width="125" alt="Player poker chips" />
        <p>
          <strong>
            {currentUser?.Username || 'Player'}'s balance: {playerMax}$
          </strong>
        </p>
      </div>
    </div>
  );
}

export default DisplayBalances;
