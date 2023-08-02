const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passportLocalMongoose = require('passport-local-mongoose');
const userModel = require("../models/user");

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

router.get('/login', asyncError(async (req, res) => {
    res.render('login');
}));

router.post('/login', asyncError(async (req, res) => {
    const { email, password } = req.body;
    res.send(req.body);
}));

router.get('/register', asyncError(async (req, res) => {
    res.render('register');
}));

router.post('/register', validateUserSchema, asyncError(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const userData = new userModel({ firstName, lastName, email });
    // console.log(userData);
    const newUser = await userModel.register(userData, password);
    req.flash('success', 'Successfully Registered');
    // res.send(newUser);
    res.redirect("/register");
}));

router.get('/logout', (req, res) => {
    res.render('home');
});

module.exports = router;