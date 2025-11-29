import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container bg-home">
      <nav className="navbar">
        <div className="nav-brand">EduLib 📚</div>
        <div className="nav-links">
          <Link to="/" className="nav-btn">🏠 Home</Link>
          <Link to="/admin-login" className="nav-btn">Admin 🛡️</Link>
          <Link to="/user-login" className="nav-btn">User 👤</Link>
        </div>
      </nav>
      <div className="hero-content">
        <h1>Welcome to EduLib</h1>
        <p>Discover a world of knowledge. Our digital library offers a vast collection of resources.</p>
      </div>
    </div>
  );
};
export default Home;