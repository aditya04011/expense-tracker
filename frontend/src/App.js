import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import './index.css';

/**
 * Main App component.
 * Responsible for routing only as per the latest requirements.
 */
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Main Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Redirect Root to Dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        {/* Fallback for 404s */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
