const express = require('express');
const dotenv = require('dotenv');
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