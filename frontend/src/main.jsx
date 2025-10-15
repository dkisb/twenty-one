import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './context/UserContext.jsx';
import { GameProvider } from './context/GameContext/GameContext.jsx';
import './index.css';

// Pages
import LoginPage from './components/authentication/Login/LoginPage.jsx';
import RegisterPage from './components/authentication/Register/RegisterPage.jsx';
import StartPage from './components/StartPage/StartPage.jsx';
import GameTable from './components/game/components/GameTable.jsx';
import AccountPage from './components/account/AccountPage/AccountPage.jsx';
import AccountUpdater from './components/account/AccountUpdater/AccountUpdater.jsx';

// Utility UI components
import Spinner from './components/common/Spinner.jsx';
import ErrorPage from './components/common/ErrorPage.jsx';

const queryClient = new QueryClient();

export default function AppRouter() {
  const router = createBrowserRouter([
    { path: '/', element: <LoginPage />, errorElement: <ErrorPage /> },
    { path: '/register', element: <RegisterPage />, errorElement: <ErrorPage /> },
    { path: '/startpage', element: <StartPage />, errorElement: <ErrorPage /> },
    { path: '/gamepage', element: <GameTable />, errorElement: <ErrorPage /> },
    { path: '/account', element: <AccountPage />, errorElement: <ErrorPage /> },
    { path: '/account/update', element: <AccountUpdater />, errorElement: <ErrorPage /> },
    { path: '*', element: <ErrorPage /> },
  ]);

  return <RouterProvider router={router} fallbackElement={<Spinner />} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <GameProvider>
          <AppRouter />
        </GameProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);