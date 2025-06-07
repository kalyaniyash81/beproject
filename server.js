const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = 'mongodb+srv://kalyaniyash81:namrata@cluster0.xmamh.mongodb.net/'; // Replace with your MongoDB connection string
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful!' });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ message: 'Login successful!' });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});