import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="page-container bg-user">
      <div className="glass-card" style={{color:'#333'}}>
        <h1 style={{color:'#333'}}>Thank You!</h1>
        <p style={{color:'#666', margin:'20px 0'}}>Your feedback helps us improve the library.</p>
        <Link to="/user-dashboard" className="btn-primary" style={{textDecoration:'none', color:'white', display:'inline-block', padding:'10px 20px'}}>
            Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default ThankYou;