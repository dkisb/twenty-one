import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function AccountUpdater() {
    const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state;

  useEffect(() => {
    if (!user?._id) {
      navigate(`${API_URL}/`);
    }
  }, [user, navigate, API_URL]);

  const [name, setName] = useState(user?.Username || '');
  const [password, setPassword] = useState('');

  async function handleDelete() {
    try {
      const response = await fetch(`${API_URL}/api/users/${user._id}`, { method: 'DELETE' });
      if (response.ok) {
        console.log(`User ${user._id} has been deleted`);
        navigate('/');
      } else {
        console.error('Failed to delete user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username: name, Password: password }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Updated Account:', updatedUser);
        navigate('/startpage', { state: updatedUser });
      } else {
        console.error('Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }

  return (
    <div className="updater-container">
      <h1 className="updater-header">Account Updater</h1>
      <form className="updater-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="name" className="updater-label">
            Username
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="updater-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Update Credentials</button>
      </form>

      <div className="inter-buttons">
        <button className="delete-btn" onClick={handleDelete}>
          Delete Account
        </button>
        <Link to="/startpage" state={user}>
          <button type="button">Cancel</button>
        </Link>
      </div>
    </div>
  );
}

export default AccountUpdater;
