import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../api/userApi';
import bellSvg from '../../../assets/bell.svg';
import heartSvg from '../../../assets/heart.svg';
import acornSvg from '../../../assets/acorn.svg';
import leafSvg from '../../../assets/leaf.svg';

function RegistrationPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const register = useRegister({
    onSuccess: () => navigate('/'),
    onError: (err) => console.error(err),
  });

  function handleRegistration(e) {
    e.preventDefault();
    register.mutate({ username: userName, password, email });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img src={heartSvg} alt="Heart" className="absolute top-6 left-8 w-20 md:w-28 opacity-80" />
          <img src={acornSvg} alt="Acorn" className="absolute top-6 right-8 w-20 md:w-28 opacity-80" />
          <img src={bellSvg} alt="Bell" className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80" />
          <img src={leafSvg} alt="Leaf" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80" />

          <h2 className="text-4xl font-extrabold mb-11 drop-shadow-lg text-center text-white">
            Welcome to 21 The Card Game!
          </h2>

          <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4" onSubmit={handleRegistration}>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />

                {register.isError && (
                  <p className="text-sm text-red-500">{register.error.message}</p>
                )}

                <button
                  type="submit"
                  disabled={register.isPending}
                  className="btn btn-primary w-full"
                >
                  {register.isPending ? 'Creating...' : 'Create Account'}
                </button>

                <p className="text-sm text-white text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="underline"
                  >
                    Sign in
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

export default RegistrationPage;