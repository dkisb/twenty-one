export const addPlayerCard = (card) => ({ type: 'ADD_PLAYER_CARD', card });
export const addDealerCard = (card) => ({ type: 'ADD_DEALER_CARD', card });
export const setStopClicked = () => ({ type: 'SET_STOP_CLICKED' });
export const setEnoughReached = () => ({ type: 'SET_ENOUGH_REACHED' });
export const setGameOver = (winner) => ({ type: 'SET_GAME_OVER', winner });
export const setPlayerBalance = (value) => ({ type: 'SET_PLAYER_BALANCE', value });
export const setDealerBalance = (value) => ({ type: 'SET_DEALER_BALANCE', value });
export const setTotalBet = (value) => ({ type: 'SET_TOTAL_BET', value });
export const setBetSubmitClicked = (value) => ({ type: 'SET_BET_SUBMIT_CLICKED', value });
export const resetGame = (playerBalance, dealerBalance) => ({
  type: 'RESET_GAME',
  playerBalance,
  dealerBalance,
});