const express = require("express");
const router = express.Router();
const User = require('../models/user.model.js');

router.get('/users', async (req, res) => { 
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const isTaken = await User.find( {$or: [{ username: req.body.username }, {email: req.body.email}]});
        if(isTaken.length > 0) return res.status(409).json({ error: "Username or email already taken"});
        await User.create(req.body);
        res.status(200).json({ error: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username, email: req.body.email});
        if(!user) return res.status(404).json({ error: "Wrong username or email"});
        if(user.password !== req.body.password) return res.status(401).json({ error: "Wrong password"});
        res.status(200).json({ error: "User has been successfully created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;