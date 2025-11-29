import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ onLogout }) => {
  const [resources, setResources] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); 
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResources = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:5000/api/resources');
            if(Array.isArray(res.data)) setResources(res.data);
        } catch (err) { console.error(err); }
    };
    fetchResources();
  }, []);

  const handleDownload = (filePath) => {
    // 1. Open File
    const fileUrl = `http://127.0.0.1:5000/${filePath}`;
    window.open(fileUrl, '_blank');

    // 2. Redirect to Feedback after 1 second
    setTimeout(() => {
        navigate('/provide-feedback');
    }, 1000); 
  };

  const filteredResources = resources.filter(res => {
    if (!res || !res.title) return false;
    const matchesTab = activeTab === 'All' ? true : res.type === activeTab;
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="page-container bg-user">
      <nav className="navbar">
        <div className="nav-brand">Student Portal 🎓</div>
        <button onClick={() => { onLogout(); navigate('/'); }} className="nav-btn" style={{background:'transparent'}}>Logout</button>
      </nav>

      <div className="hero-content" style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
        
        {/* Search & Tabs */}
        <div className="glass-card" style={{ width: '100%', maxWidth: '900px', padding: '20px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search for books..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding:'15px', fontSize:'1.1rem', marginBottom:'20px', border:'2px solid #ddd', background:'white', color:'#333' }}
            />
            <div className="tab-container" style={{background:'transparent', padding:0, justifyContent:'center'}}>
                {['All', 'Textbook', 'Research Paper', 'PDF', 'Document'].map(tab => (
                    <button 
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* List */}
        <div className="glass-card" style={{ width: '100%', maxWidth: '1000px', color:'#333' }}>
          <h3 style={{color:'#333'}}>Resources ({filteredResources.length})</h3>
          
          {filteredResources.length === 0 ? (
              <p style={{color:'#666', padding:'20px'}}>No results found for "{activeTab}".</p>
          ) : (
            <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredResources.map((res) => (
                    <li key={res._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', background:'#fff', borderBottom:'1px solid #eee', padding:'10px'}}>
                        <div style={{ textAlign: 'left' }}>
                            <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>
                                {res.type === 'Textbook' ? '📘' : res.type === 'Research Paper' ? '🔬' : '📄'}
                            </span>
                            <strong style={{color:'#333'}}>{res.title}</strong>
                        </div>
                        
                        <button 
                            onClick={() => handleDownload(res.filePath)}
                            className="btn-success"
                            style={{width:'auto', padding:'8px 15px', fontSize:'0.8rem', display:'inline-block', color:'#333', border:'none', cursor:'pointer'}}
                        >
                            Download ⬇
                        </button>
                    </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export default UserDashboard;