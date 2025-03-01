const { param, body, validationResult } = require('express-validator');

// Registration Validation
const validateRegister = [
    body('username')
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Error: Only alphabets allowed.')
        .notEmpty().withMessage('Error: Required field.')
        .escape(),

    body('email')
        .trim()
        .isEmail().withMessage('Error: Invalid email format.')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 }).withMessage('Error: Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Error: Password must contain an uppercase letter.')
        .matches(/[a-z]/).withMessage('Error: Password must contain a lowercase letter.')
        .matches(/\d/).withMessage('Error: Password must contain a number.')
        .matches(/[\W]/).withMessage('Error: Password must contain a special character (!@#$%^&*).'),

    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Error: Invalid role.'), 
];

// Login Validation
const validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Error: Required field.')
        .isAlphanumeric().withMessage('Error: Invalid username.')
        .escape(),

    body('password')
        .trim()
        .notEmpty().withMessage('Error: Required field.'),
];

// Update User Validation
const validateUpdateUser = [
    body('username')
        .optional()
        .trim()
        .isAlpha('en-US', { ignore: ' ' }).withMessage('Error: Only alphabets allowed.')
        .escape(),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Error: Invalid email format.')
        .normalizeEmail(),

    body('password')
        .optional()
        .isLength({ min: 8 }).withMessage('Error: Password must be at least 8 characters.')
        .matches(/[A-Z]/).withMessage('Error: Password must contain an uppercase letter.')
        .matches(/[a-z]/).withMessage('Error: Password must contain a lowercase letter.')
        .matches(/\d/).withMessage('Error: Password must contain a number.')
        .matches(/[\W]/).withMessage('Error: Password must contain a special character (!@#$%^&*).'),

    body('role')
        .optional()
        .isIn(['user', 'admin']).withMessage('Error: Invalid role.'), 
];

// Delete User Validation
const validateDeleteUser = [
    param('id')
        .trim()
        .isInt().withMessage('Error: Invalid user ID.')
];

// Function to check for validation errors
const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateUpdateUser,
    validateDeleteUser,
    checkValidation
};
