import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GameProvider } from './context/GameContext.jsx';
import { UserProvider } from './context/UserContext.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Pages
import LoginPage from './components/authentication/Login/LoginPage.jsx';
import RegisterPage from './components/authentication/Register/RegisterPage.jsx';
import StartPage from './components/game/StartPage/StartPage.jsx';
import GamePage from './components/game/GamePage/GamePage.jsx';
import AccountPage from './components/account/AccountPage/AccountPage.jsx';
import AccountUpdater from './components/account/AccountUpdater/AccountUpdater.jsx';

export default function App() {

  const router = createBrowserRouter([
    { path: '/', element: <LoginPage /> },
    { path: '/startpage', element: <StartPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
      path: '/gamepage',
      element: <GamePage />, 
    },
    { path: '/account', element: <AccountPage /> },
    { path: '/account/update', element: <AccountUpdater /> },
  ]);

  return <RouterProvider router={router} />;
}

const qc = new QueryClient();
createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={qc}>
      <UserProvider>
        <GameProvider>
          <App />
        </GameProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </StrictMode>
);