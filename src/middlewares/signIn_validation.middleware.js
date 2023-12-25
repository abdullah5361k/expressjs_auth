const { check } = require("express-validator")

const signInBodyValaidation = [check('email').isEmail().withMessage('Invalid email address'),
check('password').isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 30 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one letter, one number, and one special character')]

module.exports = signInBodyValaidation