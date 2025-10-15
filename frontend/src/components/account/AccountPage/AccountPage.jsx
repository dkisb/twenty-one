import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../api/userApi';
import heartSvg from '../../../assets/heart.svg';
import acornSvg from '../../../assets/acorn.svg';
import bellSvg from '../../../assets/bell.svg';
import leafSvg from '../../../assets/leaf.svg';

function AccountPage() {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUserProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    navigate('/');
    return null;
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
            Account statistics
          </h2>

          <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 sm:p-8">
              <div className="space-y-3">
                <div className="input input-bordered bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  Name: {user.username}
                </div>
                <div className="input input-bordered bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  Played games: {user.playedGames}
                </div>
                <div className="input input-bordered bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  Won games: {user.wonGames}
                </div>
                <div className="input input-bordered bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  Lost games: {user.lostGames}
                </div>
                <div className="input input-bordered bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white">
                  {user.username}'s balance: {user.playerBalance}$
                </div>
              </div>

              <Link to="/account/update">
                <button className="btn btn-primary w-full">Update user</button>
              </Link>
              <Link to="/startpage">
                <button className="btn btn-secondary w-full">Back to main page</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;