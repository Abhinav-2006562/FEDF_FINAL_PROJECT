import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all components
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register'; // New Import
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import ProvideFeedback from './components/ProvideFeedback';
import Thankyou from './components/Thankyou';
import './App.css';

function App() {
  const [userRole, setUserRole] = useState(null); 

  const handleLogout = () => setUserRole(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} /> {/* New Route */}
          
          {/* Login Routes */}
          <Route 
            path="/admin-login" 
            element={<Login role="admin" setUserRole={setUserRole} />} 
          />
          <Route 
            path="/user-login" 
            element={<Login role="user" setUserRole={setUserRole} />} 
          />

          {/* Protected Routes (Only accessible if logged in) */}
          <Route 
            path="/admin-dashboard" 
            element={
              userRole === 'admin' ? 
              <AdminDashboard onLogout={handleLogout} /> : 
              <Navigate to="/admin-login" />
            } 
          />
          <Route 
            path="/user-dashboard" 
            element={
              userRole === 'user' ? 
              <UserDashboard onLogout={handleLogout} /> : 
              <Navigate to="/user-login" />
            } 
          />
          
          {/* Feedback Routes */}
          <Route path="/provide-feedback" element={<ProvideFeedback />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;