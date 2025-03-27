const { body, oneOf } = require("express-validator");

const userLoginValidation = [
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/).withMessage("Password must contain at least one number, one special character, one small letter and one capital letter"),
    oneOf([
        body("login").isEmail().withMessage("Podaj prawidłowy adres email"),
        body("login").not().isEmail()
        .isLength({ min: 3 }).withMessage("Nazwa użytkownika musi mieć co najmniej 3 znaki")
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Nazwa użytkownika może zawierać tylko litery, cyfry i podkreślenia")], "Podaj prawidłowy email lub nazwę użytkownika"),
];

module.exports = userLoginValidation;