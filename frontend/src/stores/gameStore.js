import { create } from 'zustand';

const useGameStore = create((set) => ({
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
        set((state) => {
            const [nextCardId, ...remaining] = state.randomCardIds;
            return {
                randomCardIds: remaining,
                ...(isPlayer ? { yourHand: [...state.yourHand, nextCardId] } : { dealerHand: [...state.dealerHand, nextCardId] }),
            };
        });

        const id = get().randomCardIds[0];
        const response = await fetch(`/api/cards/${id}`);
        const cardData = await response.json();
        set({
            upperCardData: cardData,
            ...(isPlayer
                ? { yourHandData: [...get().yourHandData, cardData] }
                : { dealerHandData: [...get().dealerHandData, cardData] }),
        });
    },
}));

export default useGameStore;
