const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js');
const userValidation = require("../validation/user.validation.js");
const userLoginValidation = require("../validation/login.validation.js");
const checkValidation = require("../validation/check.validation.js");
const { hashPassword, verifyPassword } = require("../utils/password.utils.js");
const { createAccessToken, createRefreshToken } = require("../utils/jwt.utils.js");
const { verify } = require('jsonwebtoken')
const path = require('path');
const fs = require('fs');

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
        res.status(200).json({ message: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', userLoginValidation, checkValidation, async (req, res) => {       
    try {
        const user = await User.findOne( {$or: [{ username: req.body.login }, {email: req.body.login}]});
        if(!user) return res.status(404).json({ error: "Wrong username or email"});
        if(!await verifyPassword(req.body.password, user.password)) return res.status(401).json({ error: "Wrong password"});
        const accessToken = createAccessToken(user._id);
        const refreshToken = createRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 15 * 50 * 1000,
            path: '/'
        });
        res.status(200).json({ accessToken, message: "User has been successfully logged in" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/protected', async (req, res) => {
    const accessToken = req.headers['authorization']?.split(' ')[1]; // '?' sprawia, że jeśli nie ma 'authorization' to nie wywali błędu
    if(!accessToken) {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({ error: "Unauthorized" });
        const payload = verify(refreshToken, fs.readFileSync(path.join(__dirname, "../pub.pem"), 'utf-8'));
        if(!payload) { // refresh token is expired
            // clear cookies
            // return status 401 and error so frontend redirects uesr to proper page
        }
        // if payload is alright then check if there is a user with id from it, then check if refresh tokens match if they do then make a new refreshtoken and accesstoken and return 201
    } else if (!verify(accessToken, fs.readFileSync(path.join(__dirname, "../pub.pem"), 'utf-8'))) {
        // basicly the same
    } 
    // accesstoken is alright so return the status 200 with data
})


module.exports = router;