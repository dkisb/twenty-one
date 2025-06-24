import { StrictMode } from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import './index.css';

// Pages
import LoginPage from './components/authentication/Login/LoginPage.jsx';
import StartPage from './components/game/StartPage/StartPage.jsx';
import GamePage from './components/game/GamePage/GamePage.jsx';
import AccountPage from './components/account/AccountPage/AccountPage.jsx';
import AccountUpdater from './components/account/AccountUpdater/AccountUpdater.jsx';

export default function App() {
  const [gameKey, setGameKey] = useState(0);

  const router = createBrowserRouter([
    { path: '/', element: <StartPage /> },
    {
      path: '/gamepage',
      element: <GamePage key={gameKey} onNewGame={() => setGameKey((k) => k + 1)} />,
    },
  ]);

  return <RouterProvider router={router} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </UserProvider>
  </StrictMode>
);
