import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import './AccountPage.css';

function AccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state;

    useEffect(() => {
        if (!user?._id) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="user-account">
            <h1>Account Statistics</h1>
            <div className="user-details">
                <p><strong>Name:</strong> {user?.Username}</p>
                <p><strong>Played Games:</strong> {user?.Games}</p>
                <p><strong>Won Games:</strong> {user?.Win}</p>
                <p><strong>Lost Games:</strong> {user?.Loss}</p>
                <p><strong>Current Balance:</strong> ${user?.Balance}</p>
            </div>
            <div className="user-buttons">
                <Link to={`/update/${user?._id}`} state={user}>
                    <button>Update User</button>
                </Link>
                <Link to="/startpage" state={user}>
                    <button>Back to Main Page</button>
                </Link>
            </div>
        </div>
    );
}

export default AccountPage;
