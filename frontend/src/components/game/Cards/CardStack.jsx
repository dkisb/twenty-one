function CardStack({ numberOfCards }) {
  return (
    <div
      className="card-stack flex flex-col items-center justify-center text-center"
      aria-label={`Card stack with ${numberOfCards || 0} cards remaining`}
    >
      <img
        src="Back.jpg"
        alt={`Card stack with ${numberOfCards || 0} cards remaining`}
        className="max-h-[22vh] w-auto mx-1 shadow-xl rounded"
      />
      <p className="card-stack-text mt-2">
        <strong>
          {numberOfCards > 0 ? `Card Stack (${numberOfCards} remaining)` : 'No cards remaining in the stack'}
        </strong>
      </p>
    </div>
  );
}
export default CardStack;
