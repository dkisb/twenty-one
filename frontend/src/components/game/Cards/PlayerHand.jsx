function PlayerHand({ yourHandData, yourHandValue, user }) {
  return (
    <div className="players-hand" aria-label={`Player's hand with a value of ${yourHandValue}`}>
      {yourHandData.map((item, index) => (
        <img
          key={index}
          src={`/images/${item.frontImage}`}
          alt={`Player card: ${item.name || 'Unknown card'}`}
          className="player-card"
        />
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
