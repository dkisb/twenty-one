import { useDrawCard } from '../api/shuffleApi';
import { useGame } from '../../../context/GameContext';

export function useDealerLogic() {
  const { addDealerCard, setEnoughReached } = useGame();
  const drawCard = useDrawCard();

  async function dealDealerCardsUntilThreshold(order, delay, threshold, currentValue) {
    let i = order;
    let value = currentValue;

    try {
      while (value < threshold) {
        const card = await drawCard.mutateAsync(i);
        addDealerCard(card);
        value += card.value;
        i++;
        await new Promise((r) => setTimeout(r, delay));
      }
      setEnoughReached();
    } catch (err) {
      console.error('Dealer loop failed:', err);
    }
  }

  return { dealDealerCardsUntilThreshold };
}