const express = require('express');
const { 
    createUser, 
    getUsers, 
    loginUser, 
    updateUser, 
    deleteUser 
} = require('../controllers/userController'); // Ensure correct path

const { 
    validateRegister, 
    validateLogin, 
    validateUpdateUser, 
    validateDeleteUser, 
    checkValidation 
} = require('../middleware/validators');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', validateRegister, checkValidation, createUser);
router.post('/login', validateLogin, checkValidation, loginUser);
router.get('/', protect, adminOnly, getUsers); // Admin only access
router.put('/:id', protect, validateUpdateUser, checkValidation, updateUser);
router.delete('/:id', protect, adminOnly, validateDeleteUser, checkValidation, deleteUser);

module.exports = router;
