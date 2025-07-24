import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import StartPage from '../../game/StartPage/StartPage';
import { useUser } from '../../../context/UserContext';
import RegistrationPage from '../Register/RegisterPage';

function LoginPage() {
  const { login } = useUser();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwtToken') || null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('jwtToken', token);
  }, [token]);

  async function postLogin() {
    try {
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username: userName, password}),
      });
      if (!response.ok) {
        throw new Error('Invalid login');
      }
      const { jwt, username, roles } = await response.json();
      localStorage.setItem('jwtToken', jwt);
      login({ username, roles });
      setIsLoggedIn(true);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  }

  function switchToRegister() {
    navigate("/register");
  }

  function handleLogin(e) {
    e.preventDefault();
    postLogin({ username: userName, password });
    setToken(localStorage.getItem('jwtToken'));
    //console.log(token);
  }

  if (isLoggedIn) {
    return <StartPage />;
  }

  if (isRegistering) {
    return <RegistrationPage onSwitchToLogin={() => setIsRegistering(false)} />;
  }

  return (
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
              href="#"
              className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
                className="w-8 h-8 mr-2"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
            />
            21 Card Game
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to 21 Card Game
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
                <div>
                  <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="username"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                      type="password"
                      name="password"
                      id="password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && (
                    <p className="text-sm font-light text-red-500 dark:text-red-400">
                      {error}
                    </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                          htmlFor="remember"
                          className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                      href="#"
                      //className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                      className="text-sm font-light text-gray-500 dark:text-gray-400"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{' '}
                </p>
              </form>
              <button
                  onClick={switchToRegister}
                  //className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  className="text-sm font-light text-gray-500 dark:text-gray-400"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </section>
  );
}

export default LoginPage;