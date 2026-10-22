import React from 'react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'books', label: 'Manage Books', icon: '📚' },
    { id: 'issue', label: 'Issue Book', icon: '📤' },
    { id: 'issued', label: 'Issued Records', icon: '📋' },
  ];

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="brand" onClick={() => setActiveTab('dashboard')}>
          <span className="brand-icon">📚</span>
          <div className="brand-text">
            <span className="brand-title">Library Management</span>
            <span className="brand-subtitle">MERN Stack System</span>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
