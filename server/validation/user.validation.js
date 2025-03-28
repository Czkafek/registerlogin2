const { body } = require("express-validator");

const userValidation = [
    body("username")
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 3 }).withMessage("Username must be at least 3 characters long")
    .matches(/^[a-zA-Z0-9_]+$/).withMessage("Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia"),
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Email is not valid"),
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/).withMessage("Password must contain at least one number, one special character, one small letter and one capital letter"),
];

module.exports = userValidation;