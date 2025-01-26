const sequelize = require('./config/db');

sequelize
    .authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Error connecting to the database:', err));
