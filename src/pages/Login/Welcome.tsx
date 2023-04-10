import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (username: string, password: string, rememberMe: boolean) => void;
}

interface WelcomePageProps {
  onLoginFormSubmit: (
    username: string,
    password: string,
    rememberMe: boolean
  ) => void;
}

function WelcomePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div>
      <h1>Welcome, how's your day?</h1>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <br />
        <label>
          Remember me:
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/ai">AI input</a>
          </li>
          <li>
            <a href="/family">Family setting</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default WelcomePage;
