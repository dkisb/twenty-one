import { useState } from 'react';
import StartPage from '../../game/StartPage/StartPage';

function LoginPage() {
  const [userName, setUserName] = useState(null);
  const [password, setPassword] = useState(null);
  const [rightLogin, setRightLogin] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function postLogin(user) {
    const response = await fetch('/api/users/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    const loginUser = await response.json();
    if (loginUser === 'Invalid login') {
      setRightLogin(false);
    } else {
      setRightLogin(true);
      setActiveUser(loginUser);
      setIsLoggedIn(true);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    postLogin({ username: userName, password });
  }

  if (isLoggedIn && activeUser) {
    return <StartPage user={activeUser} onLoggedIn={setIsLoggedIn} onActiveUser={setActiveUser} />;
  }

  if (isRegistering) {
    return <RegistrationPage onSwitchToLogin={() => setIsRegistering(false)} onSuccessfulRegister={setActiveUser} />;
  }

  return (
    <div className="user-page">
      <h1 className="game-name">Welcome to the 21 card game!</h1>
      {!rightLogin && <h2 className="error-message">Wrong username or password. Please try again!</h2>}
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Please log in!</h2>
        <input onChange={(e) => setUserName(e.target.value)} type="text" placeholder="username" />
        <br />
        <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
        <br />
        <button type="submit">Login</button>
      </form>
      <div className="register-user">
        <h4 className="register-new">Don&apos;t have an account yet?</h4>
        <button onClick={() => setIsRegistering(true)}>Register</button>
      </div>
    </div>
  );
}

export default LoginPage;
