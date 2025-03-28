const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js');
const userValidation = require("../validation/user.validation.js");
const userLoginValidation = require("../validation/login.validation.js");
const checkValidation = require("../validation/check.validation.js");
const { hashPassword, verifyPassword } = require("../utils/password.utils.js");

router.get('/users', async (req, res) => { 
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/register', userValidation, checkValidation, async (req, res) => {
    try {
        const isTaken = await User.find( {$or: [{ username: req.body.username }, {email: req.body.email}]});
        if(isTaken.length > 0) return res.status(409).json({ error: "Username or email already taken"});
        const password = await hashPassword(req.body.password);
        await User.create({username: req.body.username, email: req.body.email, password: password});
        res.status(200).json({ error: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', userLoginValidation, checkValidation, async (req, res) => {       
    try {
        const user = await User.findOne( {$or: [{ username: req.body.login }, {email: req.body.login}]});
        if(!user) return res.status(404).json({ error: "Wrong username or email"});
        if(!await verifyPassword(req.body.password, user.password)) return res.status(401).json({ error: "Wrong password"});
        res.status(200).json({ error: "User has been successfully logged in" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;