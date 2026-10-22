import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ManageBooks from './pages/ManageBooks';
import IssueBook from './pages/IssueBook';
import IssuedBooks from './pages/IssuedBooks';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-layout">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="app-main">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'books' && <ManageBooks />}
        {activeTab === 'issue' && <IssueBook setActiveTab={setActiveTab} />}
        {activeTab === 'issued' && <IssuedBooks setActiveTab={setActiveTab} />}
      </main>
      <footer className="app-footer">
        <p>Simple Library Management System • MERN Stack MCA Project</p>
      </footer>
    </div>
  );
}

export default App;
