import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
    onSuccess: () => {
      toast.success('Account created successfully! Please login');
      navigate('/');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || 'Registration failed. Please try again');
    },
  });

  function handleRegistration(e) {
    e.preventDefault();
    register.mutate({ username: userName, password, email });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-2 sm:px-4 py-4 sm:py-8">
      <div className="p-2 sm:p-4 md:p-6 bg-[#4B2E1F] rounded-[40px] sm:rounded-[60px] md:rounded-[90px] shadow-inner w-full max-w-[90rem]">
        <div className="w-full aspect-[16/10] max-h-[85vh] bg-poker-table rounded-[30px] sm:rounded-[50px] md:rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-3 sm:px-6 md:px-8 py-4 overflow-hidden">
          <img src={heartSvg} alt="Heart" className="absolute top-3 sm:top-6 left-4 sm:left-8 w-12 sm:w-16 md:w-20 lg:w-28 opacity-80" />
          <img src={acornSvg} alt="Acorn" className="absolute top-3 sm:top-6 right-4 sm:right-8 w-12 sm:w-16 md:w-20 lg:w-28 opacity-80" />
          <img src={bellSvg} alt="Bell" className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 w-12 sm:w-16 md:w-20 lg:w-28 opacity-80" />
          <img src={leafSvg} alt="Leaf" className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 w-12 sm:w-16 md:w-20 lg:w-28 opacity-80" />

          <h2 className="text-sm sm:text-xl md:text-2xl lg:text-4xl font-extrabold mb-2 sm:mb-4 md:mb-8 lg:mb-11 drop-shadow-lg text-center text-white px-2">
            Welcome to 21 The Card Game!
          </h2>

          <div className="w-[85%] sm:w-[75%] md:w-full bg-gray-800/90 border border-gray-700 rounded-lg shadow-2xl sm:max-w-md xl:p-0 backdrop-blur-sm">
            <div className="p-2 sm:p-4 md:p-6 lg:p-8 space-y-2 sm:space-y-3 md:space-y-4">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
                Create an account
              </h1>
              <form className="space-y-2 sm:space-y-3 md:space-y-4" onSubmit={handleRegistration}>
                <input
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="input input-bordered input-xs sm:input-sm md:input-md w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600 text-xs sm:text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input input-bordered input-xs sm:input-sm md:input-md w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600 text-xs sm:text-sm"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input input-bordered input-xs sm:input-sm md:input-md w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600 text-xs sm:text-sm"
                />

                {register.isError && (
                  <p className="text-[10px] sm:text-xs md:text-sm text-red-500">{register.error.message}</p>
                )}

                <button
                  type="submit"
                  disabled={register.isPending}
                  className="btn btn-primary btn-xs sm:btn-sm md:btn-md w-full text-xs sm:text-sm md:text-base"
                >
                  {register.isPending ? 'Creating...' : 'Create Account'}
                </button>

                <p className="text-[10px] sm:text-xs md:text-sm text-gray-300 text-center">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="underline text-white hover:text-gray-200"
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