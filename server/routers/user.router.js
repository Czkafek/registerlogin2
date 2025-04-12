const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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

router.get('/register', async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if(!token) return res.status(401).json({ error: "Unauthorized - missing token"});
        const payload = verify(token, fs.readFileSync(path.join(__dirname, "../pub.pem"), 'utf-8'));
        if(payload) return res.status(200).json({ error: "Authorized - valid token"});
        res.status(401).json({ error: "Unauthorized - invalid token" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

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
            maxAge: 15 * 60 * 1000
        });
        res.status(200).json({ accessToken, message: "User has been successfully logged in" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/protected', async (req, res) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1]; // '?' sprawia, że jeśli nie ma 'authorization' to nie wywali błędu
        if(!accessToken) return res.status(401).json({ error: "Unauthorized - missing token" });
        const payload = verify(accessToken, fs.readFileSync(path.join(__dirname, "../pub.pem"), 'utf-8'));
        if(!payload) return res.status(401).json({ error: "Unauthorized - invalid token" });
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        console.error("Error in /protected endpoint: ", err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/refresh_token', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        console.log(req.cookies.refreshToken);
        if(!token) return res.clearCookie("refreshToken").status(401).json({ err: "No token", accessToken: '' });
        const payload = verify(token, fs.readFileSync(path.join(__dirname, "../pub.pem"), 'utf-8'));
        if(!payload) return res.clearCookie("refreshToken").status(401).json({ err: "Verify", accessToken: '' });
        const user = await User.findById(payload.userId);
        if(token !== user.refreshToken) return res.clearCookie("refreshToken").status(401).json({ err: "Db", accessToken: '' });
        const accessToken = createAccessToken(user._id);
        const newRefreshToken = createRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000,
            path: '/'
        });
        console.log("Hej");
        return res.status(200).json({ accessToken });
    } catch(err) {
        console.error("Error in /refresh_token endpoint: ", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/logout', (req, res) => {
    try {
        return res.clearCookie("refreshToken").status(200).json({ message: 'Logged out' });
    } catch (err) {
        return res.status(500).json({ message: "Logout failed" });
    }
})

router.get('/cookies', (req,res) => {
    try {
        return res.json(req.cookies);
    } catch (err) {
        return res.status(500).json({ message: "Error with cookies"});
    }
})

module.exports = router;