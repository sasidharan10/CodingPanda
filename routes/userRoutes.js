const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const userModel = require("../models/userModel");

const { userSchema } = require('../utils/schemaValidation');
const Errorhandler = require('../utils/errorHandler');
const asyncError = require('../utils/asyncErrorHandler');

const validateUserSchema = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new Errorhandler(msg, 400);
    }
    else {
        next();
    }
}

// const userAuthenticate = (req, res, next) => {
//     passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' });
//     next();
// }

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

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true }), asyncError(async (req, res) => {
    // const { email, password } = req.body;
    req.flash('success', 'Successfully Logged In');
    res.redirect("webdev");
}));

router.get('/logout', (req, res) => {
    res.render('home');
});

module.exports = router;