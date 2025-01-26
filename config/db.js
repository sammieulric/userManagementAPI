const { Sequelize } = require('sequelize');

// Initialize SQLite connection
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './user_api.db', // Path to the SQLite database file
    logging: false, // Disable SQL query logging
});

// Test connection
sequelize
    .authenticate()
    .then(() => console.log('SQLite database connected successfully.'))
    .catch((error) => console.error('Error connecting to SQLite database:', error));

module.exports = sequelize;
