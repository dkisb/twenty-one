import { useGame } from '../../../context/GameContext/GameContext';

export function useOutcomeCheck(modalRef, setOutcomeMessage) {
  const { state, dealerHandValue, yourHandValue, setGameOver } = useGame();

  function determineOutcome() {
    const { enoughReached, dealerHand, yourHand } = state;
    const dealerBust = dealerHandValue >= 22 && dealerHand.length > 2;
    const playerBust = yourHandValue >= 22 && yourHand.length > 2;
    const dealerBlackjack = dealerHandValue === 22 && dealerHand.length === 2;
    const playerBlackjack = yourHandValue === 22 && yourHand.length === 2;

    if (dealerBust) return { winner: 'player', message: 'Congratulations, you won!' };
    if (playerBust) return { winner: 'dealer', message: 'Sorry, you lost!' };
    if (playerBlackjack) return { winner: 'player', message: 'FIRE! Congratulations, you won!' };
    if (dealerBlackjack && enoughReached) return { winner: 'dealer', message: 'FIRE! Sorry, you lost!' };

    if (enoughReached) {
      if (dealerHandValue >= yourHandValue && dealerHandValue < 22)
        return { winner: 'dealer', message: 'Sorry, you lost!' };
      if (dealerHandValue < yourHandValue)
        return { winner: 'player', message: 'Congratulations, you won!' };
    }

    return { winner: null, message: '' };
  }

  function checkOutcome() {
    const { winner, message } = determineOutcome();
    if (!winner) return;
    setGameOver(winner);
    setOutcomeMessage(message);
    setTimeout(() => modalRef.current?.showModal(), 100);
  }

  return { checkOutcome };
}