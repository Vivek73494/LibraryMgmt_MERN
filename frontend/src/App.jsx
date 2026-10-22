import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
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
        {activeTab === 'issue' && <IssueBook setActiveTab={setActiveTab} />}
        {activeTab === 'issued' && <IssuedBooks setActiveTab={setActiveTab} />}
      </main>
    </div>
  );
}

export default App;
