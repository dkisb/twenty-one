import { useState } from 'react';
import './RegistrationPage.css';

function RegistrationPage({ onSwitchToLogin, onSuccessfulRegister }) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [existedUser, setExistedUser] = useState(false);

    async function postRegistration(user) {
        const response = await fetch('/api/users/registration/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        const newUser = await response.json();
        if (newUser === 'The username already exists') {
            setExistedUser(true);
        } else {
            setExistedUser(false);
            onSuccessfulRegister(newUser);
        }
    }

    function handleRegistration(e) {
        e.preventDefault();
        postRegistration({ username: userName, password });
    }

    return (
        <div className="registration-form">
            <h2>Register to our site</h2>
            {existedUser && <h2 className="error-message">This user already exists. Try a new name!</h2>}
            <form onSubmit={handleRegistration}>
                <input onChange={(e) => setUserName(e.target.value)} type="text" placeholder="username" />
                <br />
                <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
                <br />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <button onClick={onSwitchToLogin}>Login</button>
            </p>
        </div>
    );
}

export default RegistrationPage;
