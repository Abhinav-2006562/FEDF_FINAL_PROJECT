import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ onLogout }) => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('Textbook'); 
  const navigate = useNavigate();

  useEffect(() => { fetchResources(); }, []);

  // CLEAR INPUTS ON TAB SWITCH
  useEffect(() => {
    setTitle('');
    setFile(null);
  }, [activeTab]);

  const fetchResources = async () => {
    try {
        const res = await axios.get('http://127.0.0.1:5000/api/resources');
        setResources(res.data);
    } catch (err) { console.error(err); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) return alert("Please fill all fields");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', activeTab);
    formData.append('file', file);

    try {
        await axios.post('http://127.0.0.1:5000/api/resources', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert("Uploaded Successfully!");
        setTitle('');
        setFile(null);
        fetchResources();
    } catch (err) { alert("Upload Failed"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Are you sure?")) {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/resources/${id}`);
            setResources(resources.filter(res => res._id !== id));
        } catch (err) { alert("Delete Failed"); }
    }
  };

  const currentResources = resources.filter(res => res.type === activeTab);

  return (
    <div className="page-container bg-admin">
      <nav className="navbar">
        <div className="nav-brand">Admin Panel 🛡️</div>
        <button onClick={() => { onLogout(); navigate('/'); }} className="nav-btn" style={{background:'transparent'}}>Logout</button>
      </nav>

      <div className="tab-container">
        {['Textbook', 'Research Paper', 'PDF', 'Document'].map((tab) => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}s
          </button>
        ))}
      </div>

      <div className="hero-content" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* UPLOAD CARD */}
        <div className="glass-card" style={{ flex: 1, color: '#333' }}>
          <h3 style={{color:'#333', marginBottom:'10px'}}>Upload New {activeTab}</h3>
          
          <form onSubmit={handleUpload}>
            <input 
              key={`title-${activeTab}`} 
              type="text" 
              placeholder={`Enter ${activeTab} Title...`} 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              style={{background:'#f9f9f9', color:'#333'}}
            />
            <input 
                key={`file-${activeTab}`}
                type="file" 
                onChange={(e) => setFile(e.target.files[0])}
                style={{background:'#f9f9f9', color:'#333', padding:'10px', marginTop:'10px'}}
            />
            <button type="submit" className="btn-primary" style={{color:'white', marginTop:'15px'}}>Upload Now</button>
          </form>
        </div>

        {/* LIST CARD */}
        <div className="glass-card" style={{ flex: 1, color: '#333' }}>
          <h3 style={{color:'#333', marginBottom:'10px'}}>Manage {activeTab}s</h3>
          
          {currentResources.length === 0 ? (
             <div style={{color:'#555', padding:'20px', border:'2px dashed #ccc', borderRadius:'10px'}}>
                 No {activeTab}s found.
             </div>
          ) : (
            <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {currentResources.map((res) => (
                <li key={res._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px', paddingBottom:'8px', borderBottom:'1px solid #eee'}}>
                  <div style={{textAlign:'left'}}>
                      <strong style={{color:'#333'}}>{res.title}</strong>
                  </div>
                  <button 
                    onClick={() => handleDelete(res._id)} 
                    className="btn-danger" 
                    style={{width:'auto', padding:'5px 10px', fontSize:'0.8rem'}}
                  >
                    Remove
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
export default AdminDashboard;