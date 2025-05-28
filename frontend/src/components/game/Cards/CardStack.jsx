function CardStack({ numberOfCards }) {
  return (
    <div className="card-stack" aria-label={`Card stack with ${numberOfCards || 0} cards remaining`}>
      <img
        src="http://localhost:3000/Back.jpg"
        alt={`Card stack with ${numberOfCards || 0} cards remaining`}
        className="card-stack-image"
      />
      <p className="card-stack-text">
        <strong>
          {numberOfCards > 0 ? `Card Stack (${numberOfCards} remaining)` : 'No cards remaining in the stack'}
        </strong>
      </p>
    </div>
  );
}

export default CardStack;
