import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth function
import { auth } from '../../firebase';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState(''); // Use email for Firebase authentication
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (error) {
      setError('Invalid Email or Password!');
    }
    
    setLoading(false);
  };

  return (
    <div className="conty">
    <div className="login-container">
      <h1>Admin Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
    </div>
  );
};

export default Login;