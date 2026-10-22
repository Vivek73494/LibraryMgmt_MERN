import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/api';

const Dashboard = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopies: 0,
    totalAvailableCopies: 0,
    currentlyIssuedCopies: 0,
    totalBorrowRecords: 0,
    totalSections: 0,
    sectionsBreakdown: []
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
          <h1 className="page-title">Library Overview Dashboard</h1>
          <p className="page-subtitle">Real-time statistics across 8 structured sections in MongoDB</p>
        </div>
        <button className="btn btn-secondary" onClick={loadStats} disabled={loading}>
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Calculating library statistics across all sections...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card stat-blue">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-label">Total Unique Books</span>
                <span className="stat-value">{stats.totalBooks}</span>
                <span className="stat-subtext">64 titles across 8 sections</span>
              </div>
            </div>

            <div className="stat-card stat-indigo">
              <div className="stat-icon">📂</div>
              <div className="stat-content">
                <span className="stat-label">Book Sections</span>
                <span className="stat-value">{stats.totalSections || stats.sectionsBreakdown?.length || 8}</span>
                <span className="stat-subtext">8-10 books per section</span>
              </div>
            </div>

            <div className="stat-card stat-green">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <span className="stat-label">Available Copies</span>
                <span className="stat-value">{stats.totalAvailableCopies}</span>
                <span className="stat-subtext">Ready for student borrowing</span>
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
                <span className="stat-label">Borrow Records</span>
                <span className="stat-value">{stats.totalBorrowRecords}</span>
                <span className="stat-subtext">Total issue transactions</span>
              </div>
            </div>
          </div>

          {/* Section Breakdown Grid */}
          {stats.sectionsBreakdown && stats.sectionsBreakdown.length > 0 && (
            <div className="dashboard-section-breakdown">
              <div className="section-breakdown-header">
                <h2>📚 Academic Sections Breakdown ({stats.sectionsBreakdown.length} Sections)</h2>
                <button className="btn btn-sm btn-outline" onClick={() => setActiveTab('books')}>
                  View in Books Catalog →
                </button>
              </div>
              <div className="section-cards-grid">
                {stats.sectionsBreakdown.map((sec, idx) => (
                  <div
                    key={sec.name}
                    className="section-card-item cursor-pointer"
                    onClick={() => setActiveTab('books')}
                    title="Click to view books in this section"
                  >
                    <div className="section-card-top">
                      <span className="section-num">0{idx + 1}</span>
                      <span className="badge badge-category">{sec.count} books</span>
                    </div>
                    <h3 className="section-card-title">{sec.name}</h3>
                    <div className="section-card-meta">
                      <span>Available: <strong>{sec.availableCopies}</strong> / {sec.totalCopies} copies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="dashboard-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons-group">
              <button className="btn btn-primary" onClick={() => setActiveTab('books')}>
                📚 Browse Books by Section
              </button>
              <button className="btn btn-success" onClick={() => setActiveTab('issue')}>
                📤 Issue a Book to Student
              </button>
              <button className="btn btn-secondary" onClick={() => setActiveTab('issued')}>
                📋 View Issued Books & Return
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
