import { createContext, useContext, useReducer } from 'react';
import { gameReducer, initialState } from './gameReducer';
import { useGameLogic } from './useGameLogic';
import { useUser } from '../UserContext';

const GameContext = createContext(null);
GameContext.displayName = 'GameContext';

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user, setUser } = useUser();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const logic = useGameLogic(state, dispatch, user, setUser, API_URL);

  return (
    <GameContext.Provider value={{ state, dispatch, user, setUser, ...logic }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}