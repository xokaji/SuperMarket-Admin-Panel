// pages/login/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setLoading(true); 

   
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        navigate('/home');
      } else {
        setError('Invalid Username or Password!');
      }
      setLoading(false);
    }, 1500); 
  };
  

  return (
    <div className="login-container">
      <h1>Admin Login</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        disabled={loading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={loading}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {loading && <div className="spinner"></div>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
