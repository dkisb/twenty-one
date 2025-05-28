import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

// Pages
import LoginPage from './components/authentication/Login/LoginPage.jsx';
import StartPage from './components/game/StartPage/StartPage.jsx';
import GamePage from './components/game/GamePage/GamePage.jsx';
import AccountPage from './components/account/AccountPage/AccountPage.jsx';
import AccountUpdater from './components/account/AccountUpdater/AccountUpdater.jsx';

const router = createBrowserRouter([
  // { path: '/', element: <LoginPage /> },
  { path: '/', element: <StartPage /> },
  { path: '/gamepage', element: <GamePage /> },
  // { path: '/account', element: <AccountPage /> },
  // { path: '/update/:id', element: <AccountUpdater /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
