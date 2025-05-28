import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  yourHand: [],
  dealerHand: [],
  randomCardIds: [],
  upperCardData: null,
  yourHandData: [],
  dealerHandData: [],
  yourHandValue: 0,
  dealerHandValue: 0,
  stopClicked: false,
  enoughClicked: false,
  dealerBalance: 100,
  playerBalance: 100,
  totalBet: 0,
  winner: '',
  isGameOver: false,
  betSubmitClicked: false,

  setState: (partial) => set(partial),

  drawCard: async (isPlayer = true) => {
    try {
      // Fetch the next card ID
      const nextCardId = get().randomCardIds[0];
      if (!nextCardId) {
        throw new Error('No more cards available in the stack.');
      }

      // Fetch card data from the API
      const response = await fetch(`/cards/${nextCardId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch card data: ${response.statusText}`);
      }
      const cardData = await response.json();

      // Update the state with the new card data
      set((state) => {
        const updatedHand = isPlayer ? [...state.yourHand, nextCardId] : [...state.dealerHand, nextCardId];
        const updatedHandData = isPlayer ? [...state.yourHandData, cardData] : [...state.dealerHandData, cardData];

        return {
          randomCardIds: state.randomCardIds.slice(1),
          ...(isPlayer
            ? { yourHand: updatedHand, yourHandData: updatedHandData }
            : { dealerHand: updatedHand, dealerHandData: updatedHandData }),
          upperCardData: cardData,
        };
      });
    } catch (error) {
      console.error('Error drawing card:', error.message);
    }
  },
}));

export default useGameStore;
