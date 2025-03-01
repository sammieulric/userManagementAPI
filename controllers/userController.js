const { validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Create User (Registration)
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed Password on Registration:", hashedPassword);

        // Create user
        const user = await User.create({ 
            username, 
            email, 
            password: hashedPassword, 
            role: role || 'user' // Default role is 'user'
        });

        res.status(201).json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (error) {
        res.status(400).json({ message: 'Validation Error: Check your data' });
    }
};

// Get All Users (Admin-Only)
const getUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await User.findAll({ attributes: ['id', 'username', 'email', 'role'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login User
const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Debugging: Log password comparison
        //console.log("Entered Password:", password);
        //console.log("Stored Hashed Password:", user.password);

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
        //console.log("Password Match:", passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user.id, user.role);

        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update User (Self-Update & Admin Override)
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Allow users to update their own profile, but restrict role changes to admins
        if (req.user.id !== user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. You can only update your own account.' });
        }

        user.username = username || user.username;
        user.email = email || user.email;

        // Only admins can change user roles
        if (role && req.user.role === 'admin') {
            user.role = role;
        }

        // Hash password only if it's provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete User (Admin-Only)
const deleteUser = async (req, res) => {
    try {
        //console.log("🔹 Raw Request Params:", req.params);
        const { id } = req.params;
        //console.log("🔹 Extracted User ID to delete:", id, "Type:", typeof id);
        //console.log("🔹 User making request:", req.user);

        // Ensure ID is a valid number
        if (!id || isNaN(Number(id))) {
            //console.log("❌ Invalid ID format:", id);
            return res.status(400).json({ message: "Invalid user ID" });
        }

        // Find the user
        const user = await User.findByPk(Number(id));
        //console.log("🔹 Found User:", user);

        if (!user) {
            //console.log("❌ User not found:", id);
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure only admins can delete users
        if (req.user.role !== "admin") {
            //console.log("❌ Access Denied: User is not an admin", req.user.role);
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        // Delete the user
        await user.destroy();
        //console.log("✅ User deleted successfully:", id);

        return res.json({ message: "User deleted successfully." });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


module.exports = { createUser, getUsers, loginUser, updateUser, deleteUser };
