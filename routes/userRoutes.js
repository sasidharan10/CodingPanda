const express = require('express');
const router = express.Router();
const passport = require('passport');
const userModel = require("../models/userModel");


const {asyncError} = require('../utils/errorHandler');
const { validateUserSchema } = require('../utils/middleware');

function getPath(pageName) {
    let tempPath = "C:\\Users\\Lenovo\\Desktop\\Coding Panda";
    let newPath = tempPath + "\\views\\" + pageName + ".html";
    return newPath;
}

// router.get('/fakeUser', async (req, res) => {
//     res.sendFile(getPath("webdev"));
// });

router.get('/register', asyncError(async (req, res) => {
    res.render('register');
}));

router.post('/register', validateUserSchema, asyncError(async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const userData = new userModel({ firstName, lastName, email });
        // console.log(userData);
        const newUser = await userModel.register(userData, password);
        req.flash('success', 'Successfully Registered');
        // res.send(newUser);
        res.redirect("/register");
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/register");
    }
}));

router.get('/login', asyncError(async (req, res) => {
    res.render('login');
}));

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    res.redirect("/webdev");
}));

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Successfully Logged out!");
        res.redirect('/');
    });
});

module.exports = router;