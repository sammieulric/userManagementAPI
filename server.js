const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db');
const userRoutes = require('./Routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Sync database before starting server
sequelize.sync({ alter: true }) // Keeps schema updated without data loss
    .then(() => {
        console.log('Database synced and updated');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('Error syncing database:', err));

// Route to download the SQLite database file (secured)
app.get('/download-db', (req, res) => {
    const dbPath = path.join(__dirname, 'user_api.db'); 

    if (!fs.existsSync(dbPath)) {
        return res.status(404).json({ message: 'Database file not found' });
    }

    res.download(dbPath, 'user_api.db', (err) => {
        if (err) {
            console.error('Error downloading the file:', err);
            res.status(500).json({ message: 'Error downloading the database file' });
        }
    });
});

// Global Error Handler (for catching unexpected errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

