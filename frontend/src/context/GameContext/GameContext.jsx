import { createContext, useContext, useReducer, useEffect } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { useGameLogic } from './useGameLogic';
import { useUser } from '../UserContext';
import {
  setPlayerBalance,
  setDealerBalance,
  setTotalBet,
} from './gameAction';

const GameContext = createContext(null);
GameContext.displayName = 'GameContext';

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, setUser } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const logic = useGameLogic(state, dispatch, user, setUser, API_URL);

  // ✅ Sync player's balance from backend user data
  useEffect(() => {
    if (user && user.creditBalance != null && state.playerBalance === 0) {
      dispatch({ type: 'SET_PLAYER_BALANCE', value: user.creditBalance });
    }
  }, [user, state.playerBalance, dispatch]);

  // ✅ Define safe wrappers for balance dispatchers
  const setPlayerBalanceSafe = (value) => dispatch(setPlayerBalance(value));
  const setDealerBalanceSafe = (value) => dispatch(setDealerBalance(value));
  const setTotalBetSafe = (value) => dispatch(setTotalBet(value));

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        user,
        setUser,
        ...logic,
        setPlayerBalance: setPlayerBalanceSafe,
        setDealerBalance: setDealerBalanceSafe,
        setTotalBet: setTotalBetSafe,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}