import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ role, setUserRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to backend using 127.0.0.1 to avoid Windows localhost issues
      const res = await axios.post('http://127.0.0.1:5000/api/login', { username, password, role });
      
      if (res.data.success) {
        setUserRole(role);
        navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
      } else {
        alert(res.data.message); // Show "Invalid Credentials" or similar
      }
    } catch (err) {
      console.error(err);
      alert("Login Error: Is the backend running?");
    }
  };

  const bgClass = role === 'admin' ? 'bg-admin' : 'bg-user';

  return (
    <div className={`page-container ${bgClass}`}>
      {/* Top Navigation */}
      <nav className="navbar">
        <div className="nav-brand">EduLib 📚</div>
        <div className="nav-links">
            <Link to="/" className="nav-btn">🏠 Home</Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="hero-content">
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px', color: '#333' }}>
            {role === 'admin' ? '🛡️ Admin Access' : '👤 Student Access'}
          </h2>
          
          <form onSubmit={handleLogin}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              // FORCE BLACK TEXT so it's visible on white background
              style={{ color: '#333', background: '#f9f9f9', border: '1px solid #ddd' }}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ color: '#333', background: '#f9f9f9', border: '1px solid #ddd' }}
              required
            />
            <button type="submit" className="btn-primary" style={{ color: 'white', marginTop: '15px' }}>
              Secure Login
            </button>
          </form>

          {/* Helper Text */}
          <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#555' }}>
            <p style={{ marginBottom: '10px' }}>
                {role === 'admin' ? 'Master Key: admin / admin123' : 'Demo: student / student123'}
            </p>
            
            {/* Link to Registration Page */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <span>Don't have an account? </span>
                <Link to="/register" style={{ fontWeight: 'bold', color: '#333', textDecoration: 'underline' }}>
                    Create Account
                </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;