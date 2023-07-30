const express = require('express');
const router = express.Router();
const passportLocalMongoose = require('passport-local-mongoose');
const userModel = require("../models/user");

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    res.send(req.body);
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userData = new userModel({ firstName, lastName, email });
    // console.log(userData);
    try {
        const newUser = await userModel.register(userData, password);
        res.send(newUser);
    } catch (error) {
        console.log(error);
    }
});

router.get('/logout', (req, res) => {
    res.render('logout');
});

module.exports = router;