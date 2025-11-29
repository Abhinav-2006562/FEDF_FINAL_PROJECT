import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProvideFeedback = () => {
  const [rating, setRating] = useState(5);
  const [easeOfAccess, setEaseOfAccess] = useState('Very Easy');
  const [comments, setComments] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:5000/api/feedback', {
        rating,
        easeOfAccess,
        comments
      });
      navigate('/thank-you');
    } catch (err) {
      alert("Error submitting feedback");
    }
  };

  return (
    <div className="page-container bg-user">
      <div className="hero-content">
        <div className="glass-card" style={{ maxWidth: '600px', width: '100%', color:'#333' }}>
          <h2 style={{color:'#333', marginBottom:'20px'}}>How was the resource?</h2>
          <p style={{marginBottom:'20px', color:'#666'}}>
            Your download has started in a new tab. Please rate your experience.
          </p>

          <form onSubmit={handleSubmit} style={{textAlign:'left'}}>
            
            <label style={{fontWeight:'bold', display:'block', marginBottom:'10px'}}>1. Quality Rating:</label>
            <div style={{marginBottom:'20px'}}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        style={{
                            fontSize: '2rem',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: star <= rating ? '#f1c40f' : '#ccc',
                        }}
                    >
                        ★
                    </button>
                ))}
            </div>

            <label style={{fontWeight:'bold', display:'block', marginBottom:'10px'}}>2. Ease of Access:</label>
            <select 
                value={easeOfAccess} 
                onChange={(e) => setEaseOfAccess(e.target.value)}
                style={{width:'100%', padding:'10px', marginBottom:'20px', background:'#f9f9f9', color:'#333'}}
            >
                <option value="Very Easy">Very Easy</option>
                <option value="Average">Average</option>
                <option value="Difficult">Difficult</option>
            </select>

            <label style={{fontWeight:'bold', display:'block', marginBottom:'10px'}}>3. Comments:</label>
            <textarea 
                rows="4" 
                value={comments} 
                onChange={(e) => setComments(e.target.value)}
                placeholder="Any suggestions?"
                style={{width:'100%', padding:'10px', marginBottom:'20px', background:'#f9f9f9', color:'#333'}}
                required
            ></textarea>

            <button type="submit" className="btn-primary" style={{width:'100%', color:'white'}}>Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProvideFeedback;