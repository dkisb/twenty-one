import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProfile, useUpdateProfile, useDeleteUser } from '../../api/userApi';
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

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
          setTimeout(() => navigate('/account'), 1500);
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
          <img src={heartSvg} alt="Heart" className="absolute top-6 left-8 w-20 md:w-28 opacity-80" />
          <img src={acornSvg} alt="Acorn" className="absolute top-6 right-8 w-20 md:w-28 opacity-80" />
          <img src={bellSvg} alt="Bell" className="absolute bottom-8 left-8 w-20 md:w-28 opacity-80" />
          <img src={leafSvg} alt="Leaf" className="absolute bottom-8 right-8 w-20 md:w-28 opacity-80" />

          <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 sm:max-w-md xl:p-0">
            <div className="p-6 space-y-4 sm:p-8">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Edit your account
              </h1>

              <form className="space-y-4" onSubmit={handleSave}>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Username"
                  required
                />

                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Current password"
                  required
                />

                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="New password"
                />

                <input
                  type="password"
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="Confirm new password"
                />

                {message && (
                  <p className="text-sm text-red-500">{message}</p>
                )}

                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="btn btn-primary w-full"
                >
                  {updateProfile.isPending ? 'Updating...' : 'Update credentials'}
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteUser.isPending}
                  className="btn btn-error w-full"
                >
                  {deleteUser.isPending ? 'Deleting...' : 'Delete Account'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/account')}
                  className="btn btn-secondary w-full"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountUpdater;