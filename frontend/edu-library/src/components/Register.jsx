import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); 
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Using 127.0.0.1 to prevent connection errors
      const res = await axios.post('http://127.0.0.1:5000/api/register', { username, password, role });
      
      if (res.data.success) {
        alert("Registration Successful! Redirecting to login...");
        navigate('/user-login');
      } else {
        // Show the specific message from backend (e.g. "Username taken")
        alert("Error: " + res.data.message);
      }
    } catch (err) {
      console.error(err);
      // Show the actual network error
      alert("Registration Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="page-container bg-home">
      <div className="hero-content">
        <div className="glass-card" style={{color:'#333'}}>
          <h2 style={{color:'#333'}}>Create New Account</h2>
          <form onSubmit={handleRegister}>
            <input 
              type="text" 
              placeholder="Choose Username" 
              onChange={(e) => setUsername(e.target.value)} 
              required
              style={{background:'#f9f9f9', color:'#333', border:'1px solid #ccc'}}
            />
            <input 
              type="password" 
              placeholder="Choose Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required
              style={{background:'#f9f9f9', color:'#333', border:'1px solid #ccc'}}
            />
            
            <label style={{display:'block', textAlign:'left', marginTop:'10px', fontWeight:'bold'}}>I am a:</label>
            <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                style={{background:'#f9f9f9', color:'#333', padding:'10px', marginBottom:'15px', width:'100%'}}
            >
                <option value="user">Student</option>
                <option value="admin">Admin</option>
            </select>

            <button type="submit" className="btn-primary" style={{color:'white'}}>Register</button>
          </form>
          
          <p style={{marginTop:'15px'}}>
            Already have an account? <Link to="/user-login" style={{fontWeight:'bold', color:'#333'}}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;