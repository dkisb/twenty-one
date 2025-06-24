import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({ _id: 1, Username: 'demo', Games: 0, Win: 0, Loss: 0 });

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return <UserContext.Provider value={{ user, setUser, login, logout }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
