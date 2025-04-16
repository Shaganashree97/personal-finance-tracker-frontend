import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          navigate('/');
        }
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin} className="btn">Login</button>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none' }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;
