import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { HardwareList } from './pages/HardwareList';
import { CheckInOut } from './pages/CheckInOut';
import { MediaIndex } from './pages/MediaIndex';
import { AccountVault } from './pages/AccountVault';
import { MasterWorks } from './pages/MasterWorks';
import { MobileManager } from './pages/MobileManager';

function App() {
  // Default to true for the dark theme request
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    // Enforce dark mode class on body/html
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <HashRouter>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/hardware" element={<HardwareList />} />
          <Route path="/check-in-out" element={<CheckInOut />} />
          <Route path="/media" element={<MediaIndex />} />
          <Route path="/master-works" element={<MasterWorks />} />
          <Route path="/accounts" element={<AccountVault />} />
          <Route path="/mobile" element={<MobileManager />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;