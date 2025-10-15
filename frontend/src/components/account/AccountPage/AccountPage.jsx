import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import bellSvg from "../../../assets/bell.svg";
import heartSvg from "../../../assets/heart.svg";
import acornSvg from "../../../assets/acorn.svg";
import leafSvg from "../../../assets/leaf.svg";
import {useUser} from '../../../context/UserContext';

function AccountPage() {
  const API_URL = import.meta.env.VITE_API_URL;
 // const location = useLocation();
  const navigate = useNavigate();
  //const user = location.state;
  const {user} = useUser();

  useEffect(() => {
    if (!user) {
      navigate(`/`);
    }
  }, [user, navigate, API_URL]);
  /*
  return (
    <div className="user-account">
      <h1>Account Statistics</h1>
      <div className="user-details">
        <p>
          <strong>Name:</strong> {user?.username}
        </p>
        <p>
          <strong>Played Games:</strong> {user?.playedGames}
        </p>
        <p>
          <strong>Won Games:</strong> {user?.wonGames}
        </p>
        <p>
          <strong>Lost Games:</strong> {user?.lostGames}
        </p>
        <p>
          <strong>Current Balance:</strong> ${user?.playerBalance}
        </p>
      </div>
      <div className="user-buttons">
        <Link to={`/account/update`} state={user}>
          <button>Update User</button>
        </Link>
        <Link to={`/startpage`} state={user}>
          <button>Back to Main Page</button>
        </Link>
      </div>
    </div>
  );
  */
  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img
            src={heartSvg}
            alt="Heart"
            className="absolute top-6 left-8 w-20 md:w-28 opacity-80 -rotate-6 pointer-events-none"
          />
          <img
            src={acornSvg}
            alt="Acorn"
            className="absolute top-6 right-8 w-20 md:w-28 opacity-80 rotate-12 pointer-events-none"
          />
          <img
            src={bellSvg}
            alt="Bell"
            className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80 -rotate-12 pointer-events-none"
          />
          <img
            src={leafSvg}
            alt="Leaf"
            className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80 rotate-6 pointer-events-none"
          />

          <img
            src="/hungarian-cards.png"
            alt="Hungarian Cards Left"
            className="absolute left-10 top-1/2 -translate-y-1/2 w-32 md:w-80 opacity-90 rotate-[1deg] pointer-events-none"
          />
          <img
            src="/hungarian-cards.png"
            alt="Hungarian Cards Right"
            className="absolute right-10 top-1/2 -translate-y-1/2 w-50 md:w-80 opacity-90 rotate-[-1deg] -scale-x-100 pointer-events-none"
          />
          <h2 className="text-4xl font-extrabold mb-11 drop-shadow-lg text-center text-white">
            Account statistics
          </h2>

          <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 dark:bg-gray-800 md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></div>
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  Name: {user.username}
                </div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></div>
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  Played games: {user.playedGames}
                </div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></div>
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  Won games: {user.wonGames}
                </div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></div>
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  Lost games: {user.lostGames}
                </div>
                <div className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"></div>
                <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  {user.username}'s balance: {user.playerBalance}
                </div>
              </div>

              <div>
                <Link to={`/account/update`} state={user}>
                  <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Update user
                  </button>
                </Link>
              </div>
              <div>
                <Link to={`/startpage`} state={user}>
                  <button className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Back to main page
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
