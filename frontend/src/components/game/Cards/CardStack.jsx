function CardStack({ numberOfCards }) {
    return (
        <div className="card-stack">
            <img src="http://localhost:3000/Back.jpg" alt="Card stack" />
            <p><strong>Card Stack ({numberOfCards} remaining)</strong></p>
        </div>
    );
}

export default CardStack;
