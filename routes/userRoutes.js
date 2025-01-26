const express = require('express');
const {
    createUser,
    getUsers,
    loginUser,
    updateUser,
    deleteUser,
} = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser); // Create User
router.get('/', getUsers); // Get All Users
router.post('/login', loginUser); // Login
router.put('/:id', updateUser); // Update User
router.delete('/:id', deleteUser); // Delete User

module.exports = router;
