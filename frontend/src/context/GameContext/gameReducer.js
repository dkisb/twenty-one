export const initialState = {
  yourHand: [],
  dealerHand: [],
  playerBalance: 0,
  dealerBalance: 100,
  totalBet: 0,
  isGameOver: false,
  winner: null,
  stopClicked: false,
  enoughReached: false,
  betSubmitClicked: false,
  nextCardInOrder: 1,
  numberOfCards: 32,
  upperCardData: null,
};

export function handValue(hand) {
  return hand.reduce((sum, card) => sum + card.value, 0);
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'RESET_GAME':
      return {
        ...initialState,
        playerBalance: action.playerBalance,
        dealerBalance: action.dealerBalance,
      };

    case 'ADD_PLAYER_CARD':
      return {
        ...state,
        yourHand: [...state.yourHand, action.card],
        upperCardData: action.card,
        nextCardInOrder: state.nextCardInOrder + 1,
        numberOfCards: state.numberOfCards - 1,
        betSubmitClicked: false,
      };

    case 'ADD_DEALER_CARD':
      return {
        ...state,
        dealerHand: [...state.dealerHand, action.card],
        nextCardInOrder: state.nextCardInOrder + 1,
        numberOfCards: state.numberOfCards - 1,
      };

    case 'SET_GAME_OVER':
      return { ...state, isGameOver: true, winner: action.winner };

    case 'SET_TOTAL_BET':
      return { ...state, totalBet: action.value };

    case 'SET_STOP_CLICKED':
      return { ...state, stopClicked: true };

    case 'SET_ENOUGH_REACHED':
      return { ...state, enoughReached: true };

    case 'SET_PLAYER_BALANCE':
      return { ...state, playerBalance: action.value };

    case 'SET_DEALER_BALANCE':
      return { ...state, dealerBalance: action.value };

    case 'SET_BET_SUBMIT_CLICKED':
      return { ...state, betSubmitClicked: action.value };

    default:
      return state;
  }
}