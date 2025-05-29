function PlayerHand({ yourHandData, yourHandValue, user }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {/* Cards */}
      <div className="flex gap-2 justify-center flex-wrap">
        {yourHandData.map((card, index) => (
          <img
            key={index}
            src={card.frontImagePath}
            alt={`Card ${index + 1}`}
            className="player-card w-24 md:w-28 xl:w-32"
          />
        ))}
      </div>

      {/* Username and Value stacked below */}
      <p className="text-lg font-bold text-white">{user?.Username || 'Player'}</p>
      <p className="text-lg font-semibold text-white">Value: {yourHandValue}</p>
    </div>
  );
}

export default PlayerHand;
