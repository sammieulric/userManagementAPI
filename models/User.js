const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[A-Za-z\s]+$/i, // Only alphabets and spaces allowed
            notEmpty: true, // Cannot be empty
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // Ensures valid email format
            notEmpty: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [8, 100], // Minimum 8 characters
        },
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // Default role
        validate: {
            isIn: [['user', 'admin']], // Restrict values to 'user' or 'admin'
        },
    }
}, {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
    hooks: {
        beforeCreate: async (user) => {
            if (!user.password.startsWith('$2a$')) { // ✅ Prevent double hashing
                user.password = await bcrypt.hash(user.password, 10);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password') && !user.password.startsWith('$2a$')) { 
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

module.exports = User;
