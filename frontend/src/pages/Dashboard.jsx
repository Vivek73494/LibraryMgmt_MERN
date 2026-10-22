import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/api';

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopies: 0,
    totalAvailableCopies: 0,
    currentlyIssuedCopies: 0,
    totalBorrowRecords: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetchDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Library Dashboard</h1>
        </div>
        <button className="btn btn-secondary" onClick={loadStats} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading library statistics...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-label">Total Book Titles</span>
                <span className="stat-value">{stats.totalBooks}</span>
                <span className="stat-subtext">Registered catalog titles</span>
              </div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Available Copies</span>
                <span className="stat-value">{stats.totalAvailableCopies}</span>
                <span className="stat-subtext">Ready to issue</span>
              </div>
            </div>

            <div className="stat-card stat-orange">
              <div className="stat-icon">📤</div>
              <div className="stat-content">
                <span className="stat-label">Currently Issued</span>
                <span className="stat-value">{stats.currentlyIssuedCopies}</span>
                <span className="stat-subtext">Active student loans</span>
              </div>
            </div>

            <div className="stat-card stat-purple">
              <div className="stat-icon">📑</div>
              <div className="stat-content">
                <span className="stat-label">Total Transactions</span>
                <span className="stat-value">{stats.totalBorrowRecords}</span>
                <span className="stat-subtext">Issue & return history</span>
              </div>
            </div>
          </div>

          <div className="dashboard-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons-group">
              <button className="btn btn-primary" onClick={() => setActiveTab('issue')}>
                📤 Issue a Book to Student
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('issued')}>
                📋 View Issued Records & Returns
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
