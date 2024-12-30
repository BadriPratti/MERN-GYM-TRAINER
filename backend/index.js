const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const dashRoutes = require('./routes/dashRoutes');
require('dotenv').config();

const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://MERNUserAccount:Ey3PHCxnHm9KoAJ9z8j@cluster0.gggbe.mongodb.net/MERNprojectDB?retryWrites=true&w=majority';

// Connect to MongoDB using mongoose
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully via Mongoose'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit if the connection fails
    });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/dash', dashRoutes);

// Start the server
const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
