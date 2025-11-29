const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create uploads folder if not exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

// Connect to MongoDB
const MONGO_URI = 'mongodb://127.0.0.1:27017/edulibrary';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error(err));

// --- 1. USER SCHEMA (This is what was missing!) ---
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});
const User = mongoose.model('User', UserSchema);

// Resource Schema
const ResourceSchema = new mongoose.Schema({
    title: String, type: String, filePath: String, uploadedAt: { type: Date, default: Date.now }
});
const Resource = mongoose.model('Resource', ResourceSchema);

// Feedback Schema
const FeedbackSchema = new mongoose.Schema({
    rating: Number, easeOfAccess: String, comments: String, submittedAt: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'))
});
const upload = multer({ storage: storage });

// --- ROUTES ---

// 2. REGISTER ROUTE (The backend needs this to work!)
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: "Username already taken" });
        }

        // Create new user
        await User.create({ username, password, role });
        console.log(`New User Registered: ${username} (${role})`);
        res.json({ success: true, message: "Registration successful!" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ success: false, message: "Error registering user" });
    }
});

// 3. UPDATED LOGIN ROUTE (Now checks the database)
app.post('/api/login', async (req, res) => {
    const { username, password, role } = req.body;

    // A. Master Admin (Always works)
    if (role === 'admin' && username === 'admin' && password === 'admin123') {
        return res.json({ success: true, message: "Master Admin Logged In" });
    }

    // B. Database Check
    try {
        const user = await User.findOne({ username, password, role });
        if (user) {
            return res.json({ success: true, message: "Login Successful" });
        } else {
            return res.json({ success: false, message: "Invalid Credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// ... (Resource routes remain the same) ...
app.post('/api/resources', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const cleanPath = req.file.path.replace(/\\/g, "/");
        const newResource = await Resource.create({ title: req.body.title, type: req.body.type, filePath: cleanPath });
        res.json(newResource);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/resources', async (req, res) => {
    const all = await Resource.find();
    res.json(all);
});

app.delete('/api/resources/:id', async (req, res) => {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.post('/api/feedback', async (req, res) => {
    await Feedback.create({ ...req.body });
    res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));