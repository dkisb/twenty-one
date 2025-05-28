function PlayerHand({ yourHandData, yourHandValue, user }) {
  return (
    <div className="players-hand" aria-label={`Player's hand with a value of ${yourHandValue}`}>
      {yourHandData.map((_, index) => (
        <img key={index} src="/hungarian-cards-cleaned.png" alt={`Mock Player card`} className="player-card" />
      ))}
      <p className="player-username">
        <strong>{user?.Username || 'Player'}</strong>
      </p>
      <p className="player-hand-value">
        <strong>Value: {yourHandValue}</strong>
      </p>
    </div>
  );
}

export default PlayerHand;
