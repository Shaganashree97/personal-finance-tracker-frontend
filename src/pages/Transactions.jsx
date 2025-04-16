/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Transactions.css';

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: 'income',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    recurring: false,
    frequency: 'monthly'
  });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({ type: 'all', startDate: '', endDate: '' });

  const token = localStorage.getItem('token');

  const fetchTransactions = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/transactions`, { headers: { 'Authorization': token } })
      .then(res => res.json())
      .then(data => setTransactions(data));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const incomeCategories = ['Salary', 'Bonus', 'Investment', 'Other'];
  const expenseCategories = ['Food', 'Bills', 'Entertainment', 'Travel', 'Healthcare', 'Other'];

  const updateCategoryOptions = (type) => type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = () => {
    if (!form.description || !form.amount || Number(form.amount) <= 0 || !form.date) {
      alert('Please enter valid details.');
      return;
    }
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId 
      ? `${import.meta.env.VITE_API_URL}/api/transactions/${editingId}` 
      : `${import.meta.env.VITE_API_URL}/api/transactions`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ ...form, amount: Number(form.amount) })
    })
      .then(() => {
        fetchTransactions();
        setForm({
          type: 'income',
          category: '',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          recurring: false,
          frequency: 'monthly'
        });
        setEditingId(null);
      });
  };

  const handleEdit = (tx) => {
    setEditingId(tx._id);
    setForm({ ...tx, date: new Date(tx.date).toISOString().split('T')[0] });
  };

  const handleDelete = (id) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/transactions/${id}`, { method: 'DELETE', headers: { 'Authorization': token } })
      .then(() => fetchTransactions());
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter.type !== 'all' && tx.type !== filter.type) return false;
    if (filter.startDate && new Date(tx.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(tx.date) > new Date(filter.endDate)) return false;
    return true;
  });

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
      <div className="transactions-container">
        <h1 className="transactions-heading">Manage Transactions</h1>
        <h2>{editingId ? "Edit Transaction" : "Add Transaction"}</h2>
        <div className="form-group">
          <label>Type:</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: '' })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category:</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {updateCategoryOptions(form.type).map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Salary, Groceries" />
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter amount" />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Recurring:</label>
          <input type="checkbox" checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} />
          {form.recurring && (
            <select value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
        <div className="form-group">
          <button onClick={handleSubmit} className="btn">{editingId ? "Update Transaction" : "Add Transaction"}</button>
          {editingId && 
            <button 
              onClick={() => { 
                setEditingId(null); 
                setForm({ 
                  type: 'income', 
                  category: '', 
                  description: '', 
                  amount: '', 
                  date: new Date().toISOString().split('T')[0], 
                  recurring: false, 
                  frequency: 'monthly' 
                }); 
              }} 
              className="btn" 
              style={{ marginLeft: '1rem' }}
            >
              Cancel Edit
            </button>
          }
        </div>
        <div className="form-group">
          <h3>Filters</h3>
          <label>Type:</label>
          <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <label>From:</label>
          <input type="date" value={filter.startDate} onChange={(e) => setFilter({ ...filter, startDate: e.target.value })} />
          <label>To:</label>
          <input type="date" value={filter.endDate} onChange={(e) => setFilter({ ...filter, endDate: e.target.value })} />
          <button onClick={() => setFilter({ ...filter })} className="btn">Apply Filters</button>
          <button onClick={() => setFilter({ type: 'all', startDate: '', endDate: '' })} className="btn" style={{ marginLeft: '1rem' }}>Clear Filters</button>
        </div>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Recurring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => (
              <tr key={tx._id}>
                <td>{new Date(tx.date).toISOString().split('T')[0]}</td>
                <td style={{ color: tx.type === 'income' ? 'green' : 'red' }}>
                  {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                </td>
                <td>{tx.category}</td>
                <td>{tx.description}</td>
                <td>${Number(tx.amount).toFixed(2)}</td>
                <td>{tx.recurring ? tx.frequency : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(tx)} className="btn">Edit</button>
                  <button onClick={() => handleDelete(tx._id)} className="btn" style={{ marginLeft: '0.5rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
