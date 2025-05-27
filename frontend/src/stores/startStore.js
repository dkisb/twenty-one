import create from 'zustand';
import { persist } from 'zustand/middleware';

const startStore = create(
  persist(
    (set, get) => ({
      // Game Initialization State
      gameStarted: false,
      randomCardIds: null,
      currentCard: null,
      dealerBalance: 100,

      // User State
      userData: null,

      // Game Actions
      startGame: async () => {
        try {
          const response = await fetch('/cards');
          const cardIds = await response.json();
          set({ randomCardIds: cardIds });

          const cardId = cardIds[0];
          const response2 = await fetch(`/cards/${cardId}`);
          const cardData = await response2.json();

          set({
            currentCard: cardData,
            gameStarted: true,
          });
        } catch (error) {
          console.error('Error starting game:', error);
          throw error;
        }
      },

      // User Management
      setUser: (userData) => set({ userData }),
      setDealerBalance: (balance) => set({ dealerBalance: balance }),

      // Game Status
      resetGame: () =>
        set({
          gameStarted: false,
          randomCardIds: null,
          currentCard: null,
        }),

      // Selectors
      getGameStatus: () => get().gameStarted,
      getCardData: () => get().currentCard,
      getCardIds: () => get().randomCardIds,
      getUserData: () => get().userData,
      getDealerBalance: () => get().dealerBalance,
    }),
    {
      name: 'start-page-storage',
      storage: localStorage,
    }
  )
);

export default startStore;
