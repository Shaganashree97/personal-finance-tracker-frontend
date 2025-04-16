import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const fileInput = useRef();

  const exportData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/export`, { headers: { 'Authorization': token } })
      .then(res => res.json())
      .then(data => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'finance_data.json';
        a.click();
        URL.revokeObjectURL(url);
      });
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        fetch(`${import.meta.env.VITE_API_URL}/api/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': token },
          body: JSON.stringify(imported)
        })
          .then(() => alert('Data imported successfully! Please refresh the pages.'));
      } catch (err) {
        alert('Error importing data.');
      }
    };
    reader.readAsText(file);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <button onClick={logout} className="logout-btn">Logout</button>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
      <div className="settings-container">
        <h1 className="settings-heading">Settings</h1>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={exportData} className="btn">Export Data</button>
          <button onClick={() => fileInput.current.click()} className="btn" style={{ marginLeft: '1rem' }}>Import Data</button>
          <input type="file" ref={fileInput} accept="application/json" style={{ display: 'none' }} onChange={importData} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
