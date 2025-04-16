/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, savings: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
      headers: { 'Authorization': token }
    })
      .then(res => res.json())
      .then(data => {
        setSummary({ totalIncome: data.totalIncome, totalExpense: data.totalExpense, savings: data.savings });
        setTransactions(data.transactions);
        renderCharts(data.transactions);
      });
  }, []);

  const renderCharts = (transactions) => {
    // Monthly Bar Chart
    const monthlyData = {};
    transactions.forEach(tx => {
      if (!tx.date) return;
      const month = new Date(tx.date).toISOString().substring(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
      monthlyData[month][tx.type] += tx.amount;
    });
    const months = Object.keys(monthlyData).sort();
    const incomes = months.map(m => monthlyData[m].income);
    const expenses = months.map(m => monthlyData[m].expense);
    const ctxBar = document.getElementById('monthlyChart').getContext('2d');
    new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          { label: 'Income', data: incomes, backgroundColor: 'rgba(16,185,129,0.6)' },
          { label: 'Expense', data: expenses, backgroundColor: 'rgba(239,68,68,0.6)' }
        ]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { position: 'bottom' } }
      }
    });
    // Pie Chart for Expense Distribution
    const expenseData = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense'){
        expenseData[tx.category] = (expenseData[tx.category] || 0) + tx.amount;
      }
    });
    const expenseCategories = Object.keys(expenseData);
    const expenseAmounts = expenseCategories.map(cat => expenseData[cat]);
    const ctxPie = document.getElementById('pieChart').getContext('2d');
    new Chart(ctxPie, {
      type: 'pie',
      data: {
        labels: expenseCategories,
        datasets: [{
          data: expenseAmounts,
          backgroundColor: ['#EF4444','#F59E0B','#10B981','#3B82F6','#8B5CF6','#EC4899']
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  };

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
      <div className="dashboard-container">
        <h1 className="dashboard-heading">Dashboard</h1>
        <div className="dashboard-summary">
          <p>Total Income: ${summary.totalIncome.toFixed(2)}</p>
          <p>Total Expenses: ${summary.totalExpense.toFixed(2)}</p>
          <p>Savings: ${summary.savings.toFixed(2)}</p>
        </div>
        <h2 className="dashboard-heading" style={{ fontSize: '1.5rem' }}>Monthly Summary Chart</h2>
        <canvas id="monthlyChart"></canvas>
        <h2 className="dashboard-heading" style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Expense Category Distribution</h2>
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
