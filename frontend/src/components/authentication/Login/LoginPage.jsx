import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StartPage from '../../StartPage/StartPage';
import { useUser } from '../../../context/UserContext';
import { useLogin, getUserProfile } from '../../api/userApi';
import bellSvg from '../../../assets/bell.svg';
import heartSvg from '../../../assets/heart.svg';
import acornSvg from '../../../assets/acorn.svg';
import leafSvg from '../../../assets/leaf.svg';

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useLogin({
    onSuccess: async ({ jwt }) => {
      localStorage.setItem('jwtToken', jwt);
      const data = await getUserProfile();
      setUser(data);
      setIsLoggedIn(true);
    },
    onError: (err) => console.error(err),
  });

  function handleLogin(e) {
    e.preventDefault();
    login.mutate({ username: userName, password });
  }

  if (isLoggedIn) return <StartPage />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img src={bellSvg} alt="Bell" className="absolute top-6 right-8 w-20 md:w-28 opacity-80 rotate-12" />
          <img src={heartSvg} alt="Heart" className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80 -rotate-12" />
          <img src={acornSvg} alt="Acorn" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80 rotate-6" />
          <img src={leafSvg} alt="Leaf" className="absolute top-6 left-8 w-20 md:w-28 opacity-80 -rotate-6" />

          <h2 className="text-4xl font-extrabold mb-11 drop-shadow-lg text-center text-white">
            Welcome to 21 The Card Game!
          </h2>
          <div className="w-full bg-gray-800/90 border border-gray-700 rounded-lg shadow-2xl sm:max-w-md xl:p-0 backdrop-blur-sm">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold leading-tight text-white">
                Sign in to your account
              </h1>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">
                    Your username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    placeholder="username"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {login.isError && (
                  <p className="text-sm text-red-500">{login.error.message}</p>
                )}

                <button
                  type="submit"
                  disabled={login.isPending}
                  className="btn btn-primary w-full"
                >
                  {login.isPending ? 'Signing in...' : 'Sign in'}
                </button>

                <p className="text-sm text-gray-300 text-center">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="underline text-white hover:text-gray-200"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;