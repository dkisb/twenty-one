import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useUpdateProfile, useDeleteUser } from '../../api/userApi';
import Spinner from '../../common/Spinner';
import heartSvg from '../../../assets/heart.svg';
import acornSvg from '../../../assets/acorn.svg';
import bellSvg from '../../../assets/bell.svg';
import leafSvg from '../../../assets/leaf.svg';

function AccountUpdater() {
  const navigate = useNavigate();
  const { data: user, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const deleteUser = useDeleteUser();

  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  if (isLoading) return <Spinner />;
  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    updateProfile.mutate(
      { username, password, newPassword },
      {
        onSuccess: (data) => {
          setMessage(data.message || 'Profile updated successfully.');
          setTimeout(() => navigate('/'), 1000);
        },
        onError: (err) => setMessage(err.message),
      },
    );
  };

  const handleDelete = () => {
    deleteUser.mutate(undefined, {
      onSuccess: () => navigate('/'),
      onError: (err) => setMessage(err.message),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-table-background px-4 py-8">
      <div className="p-4 sm:p-6 bg-[#4B2E1F] rounded-[90px] shadow-inner w-full max-w-[80rem]">
        <div className="w-full h-[42rem] bg-poker-table rounded-[70px] shadow-2xl flex flex-col items-center justify-center relative text-white px-6 sm:px-8">
          <img src={bellSvg} alt="Bell" className="absolute top-6 right-8 w-20 md:w-28 opacity-80 rotate-12" />
          <img src={heartSvg} alt="Heart" className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80 -rotate-12" />
          <img src={acornSvg} alt="Acorn" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80 rotate-6" />
          <img src={leafSvg} alt="Leaf" className="absolute top-6 left-8 w-20 md:w-28 opacity-80 -rotate-6" />

          <div className="w-full bg-gray-800/90 border border-gray-700 rounded-lg shadow-2xl sm:max-w-md xl:p-0 backdrop-blur-sm">
            <div className="p-6 space-y-6 sm:p-8">
              <h1 className="text-xl font-bold tracking-tight text-center text-white mb-4">
                Edit your Account
              </h1>
              <form className="space-y-4" onSubmit={handleSave}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                  placeholder="Username"
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                  placeholder="Current password"
                  required
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                  placeholder="New password"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                  placeholder="Confirm new password"
                />

                {message && (
                  <p className="text-sm text-red-500 text-center">{message}</p>
                )}

                <div className="space-y-4 pt-2">
                  <button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="btn btn-primary w-full py-2 text-white text-lg"
                  >
                    {updateProfile.isPending ? 'Updating...' : 'Update Credentials'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteUser.isPending}
                    className="btn btn-primary w-full py-2 text-white text-lg"
                  >
                    {deleteUser.isPending ? 'Deleting...' : 'Delete Account'}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="btn btn-primary w-full py-2 text-white text-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountUpdater;