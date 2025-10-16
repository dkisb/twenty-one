import { Link, useNavigate } from 'react-router-dom';
import { useUserProfile } from '../../api/userApi';
import Spinner from '../../common/Spinner';
import heartSvg from '../../../assets/heart.svg';
import acornSvg from '../../../assets/acorn.svg';
import bellSvg from '../../../assets/bell.svg';
import leafSvg from '../../../assets/leaf.svg';

function AccountPage() {
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useUserProfile();

  if (isLoading) return <Spinner />;
  if (isError || !user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img src={bellSvg} alt="Bell" className="absolute top-6 right-8 w-20 md:w-28 opacity-80 rotate-12" />
          <img src={heartSvg} alt="Heart" className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80 -rotate-12" />
          <img src={acornSvg} alt="Acorn" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80 rotate-6" />
          <img src={leafSvg} alt="Leaf" className="absolute top-6 left-8 w-20 md:w-28 opacity-80 -rotate-6" />

          <h2 className="text-4xl font-extrabold mb-11 drop-shadow-lg text-center text-white">
            Account Overview
          </h2>

          <div className="w-full bg-gray-800/90 border border-gray-700 rounded-lg shadow-2xl sm:max-w-md xl:p-0 backdrop-blur-sm">
            <div className="p-6 space-y-6 sm:p-8">
              <h1 className="text-xl font-bold text-white mb-4 text-center">
                {user.username}'s Statistics
              </h1>
              <div className="space-y-3 text-gray-200">
                <div className="input input-bordered w-full bg-gray-700 text-white border-gray-600">
                  <strong>Name:</strong> {user.username}
                </div>
                <div className="input input-bordered w-full bg-gray-700 text-white border-gray-600">
                  <strong>Played games:</strong> {user.playedGames}
                </div>
                <div className="input input-bordered w-full bg-gray-700 text-white border-gray-600">
                  <strong>Won games:</strong> {user.wonGames}
                </div>
                <div className="input input-bordered w-full bg-gray-700 text-white border-gray-600">
                  <strong>Lost games:</strong> {user.lostGames}
                </div>
                <div className="input input-bordered w-full bg-gray-700 text-white border-gray-600">
                  <strong>Balance:</strong> {user.playerBalance}$
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Link to="/account/update">
                  <button className="btn btn-primary w-full py-2 text-white text-lg">Update Account</button>
                </Link>
                <Link to="/startpage">
                  <button className="btn btn-primary w-full py-2 text-white text-lg mt-2">
                    Back to Main Page
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountPage;