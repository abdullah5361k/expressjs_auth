const { check } = require("express-validator")

const signUpBodyValaidation = [check('name').notEmpty().withMessage('Name is required'),
check('email').isEmail().withMessage('Invalid email address'),
check('password').isLength({ min: 6, max: 30 }).withMessage('Password must be between 6 and 30 characters')
    .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .withMessage('Password must contain at least one letter, one number, and one special character'),
check('confirmPassword').notEmpty().withMessage('Confirm password is required').custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error("Password confirmation does not match with password")
    }
    return true
})]

module.exports = signUpBodyValaidation