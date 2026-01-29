// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
// Import routing components
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Import CSS
import './App.css';

// Import page components (we'll create these next)
import Dashboard from './pages/Dashboard';
import TimetableGenerator from './pages/TimetableGenerator';
import TimetableView from './pages/TimetableView';
import Login from './pages/Login';

// Main App component
function App() {
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // useEffect runs when component mounts (like componentDidMount)
  useEffect(() => {
    // Check if user has token in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []); // Empty dependency array means run once on mount
  
  // Function to handle login
  const handleLogin = (token) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
  };
  
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };
  
  return (
    // Router enables client-side routing
    <Router>
      <div className="App">
        {/* Navigation bar would go here */}
        
        {/* Routes defines URL paths and their components */}
        <Routes>
          {/* If at root path, redirect to dashboard */}
          <Route path="/" element={
            isAuthenticated ? 
              <Dashboard onLogout={handleLogout} /> : 
              <Navigate to="/login" />
          } />
          
          {/* Login route */}
          <Route path="/login" element={
            <Login onLogin={handleLogin} />
          } />
          
          {/* Generator route */}
          <Route path="/generate" element={
            isAuthenticated ? 
              <TimetableGenerator /> : 
              <Navigate to="/login" />
          } />
          
          {/* View timetable route */}
          <Route path="/timetable/:id" element={
            isAuthenticated ? 
              <TimetableView /> : 
              <Navigate to="/login" />
          } />
          
          {/* 404 route - catches undefined paths */}
          <Route path="*" element={
            <div>404 - Page Not Found</div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// Export App component to be used in main.jsx
export default App;