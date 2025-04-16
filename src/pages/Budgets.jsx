/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Budgets.css';

const Budgets = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [budgets, setBudgets] = useState({});
  const [transactions, setTransactions] = useState([]);
  const expenseCategories = ['Food', 'Bills', 'Entertainment', 'Travel', 'Healthcare', 'Other'];

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, { headers: { 'Authorization': token } })
      .then(res => res.json())
      .then(data => setBudgets(data.budgets || {}));
    fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, { headers: { 'Authorization': token } })
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const handleChange = (cat, value) => {
    setBudgets({ ...budgets, [cat]: Number(value) });
  };

  const saveBudgets = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/budgets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ budgets })
    })
      .then(() => alert('Budgets saved!'));
  };

  const currentMonth = new Date().toISOString().substring(0, 7);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar">
        <ul>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/budgets">Budgets</Link></li>
          <li><Link to="/settings">Settings</Link></li>
          <button onClick={logout} className="logout-btn">Logout</button>
        </ul>
      </nav>
      <div className="budgets-container">
        <h1 className="budgets-heading">Budget Manager</h1>
        {expenseCategories.map(cat => (
          <div key={cat} className="budget-item">
            <label>{cat}:</label>
            <input type="number" placeholder="Monthly budget" value={budgets[cat] || ''} onChange={(e) => handleChange(cat, e.target.value)} />
          </div>
        ))}
        <button onClick={saveBudgets} className="btn">Save Budgets</button>
        <div style={{ marginTop: '1rem' }}>
          <h3>Budget Summary (Current Month)</h3>
          {expenseCategories.map(cat => {
            const budget = budgets[cat] || 0;
            const spent = transactions.filter(tx =>
              tx.type === 'expense' &&
              tx.category === cat &&
              new Date(tx.date).toISOString().substring(0, 7) === currentMonth
            ).reduce((sum, tx) => sum + tx.amount, 0);
            return (
              <p key={cat}>
                {cat}: Budget ${budget}, Spent ${spent.toFixed(2)} {spent > budget ? <span style={{ color: 'red' }}>(Over Budget!)</span> : <span style={{ color: 'green' }}>(Within Budget)</span>}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Budgets;
