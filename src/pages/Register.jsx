import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert('Registration successful! You can now log in.');
          navigate('/login');
        }
      });
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <input type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister} className="btn">Register</button>
      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none' }}>Login here</Link>
      </p>
    </div>
  );
};

export default Register;
