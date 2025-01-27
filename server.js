const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const sequelize = require('./config/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

// Sync database and start server
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error('Error syncing database:', err));

sequelize.sync({ alter: true })
    .then(() => console.log('Database updated with new column'))
    .catch((err) => console.error('Error updating database:', err));


// Route to download the SQLite database file
app.get('/download-db', (req, res) => {
    const dbPath = path.join(__dirname, 'user_api.db'); // Adjust this if the database file is in a subfolder
    if (fs.existsSync(dbPath)) {
        res.download(dbPath, 'user_api.db', (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send('Error downloading the database file');
            }
        });
    } else {
        res.status(404).send('Database file not found');
    }

})