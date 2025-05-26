function PlayerHand({ yourHandData, yourHandValue, user }) {
    return (
        <div className="players-hand">
            {yourHandData.map((item, index) => (
                <img
                    key={index}
                    src={`http://localhost:3000${item.frontImage}`}
                    alt="Player card"
                />
            ))}
            <p><strong>{user?.Username}</strong></p>
            <p><strong>Value: {yourHandValue}</strong></p>
        </div>
    );
}

export default PlayerHand;
