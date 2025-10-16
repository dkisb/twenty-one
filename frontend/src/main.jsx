import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
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
    { path: '/account', element: <AccountPage />, errorElement: <ErrorPage /> },
    { path: '/account/update', element: <AccountUpdater />, errorElement: <ErrorPage /> },
    { path: '/game', element: <GameTable />, errorElement: <ErrorPage /> },
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
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </GameProvider>
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);