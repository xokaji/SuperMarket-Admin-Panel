import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; // signOut import කරගන්න
import { auth } from '../../firebase';
import './login.css';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 30 minutes in milliseconds

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now()); // Track last activity time
  const navigate = useNavigate();

  // Userගේ authentication state එක track කරන්න
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User login වී ඇති නම් home page එකට redirect කරන්න
        navigate('/home');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [navigate]);

  // Session timeout check
  useEffect(() => {
    const checkTimeout = setInterval(() => {
      const currentTime = Date.now();
      if (currentTime - lastActivity > SESSION_TIMEOUT) {
        // Session timeout වුනාට පස්සෙ user logout කරන්න
        signOut(auth).then(() => {
          navigate('/');
        });
      }
    }, 1000); // Check every second

    // Cleanup function
    return () => clearInterval(checkTimeout);
  }, [lastActivity, navigate]);

  // Update last activity time on user interaction
  const updateLastActivity = () => {
    setLastActivity(Date.now());
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, email, password);
      updateLastActivity(); // Update last activity time
    } catch (error) {
      setError('Invalid Email or Password!');
    }
    
    setLoading(false);
  };

  return (
    <div className="conty" onClick={updateLastActivity}> {/* User interaction එක track කරන්න */}
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