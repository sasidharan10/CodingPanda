const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const userModel = require("../models/userModel");
const instructorModel = require("../models/instructorModel");


const { asyncError } = require('../utils/errorHandler');
const { validateUserSchema, validateInstructorSchema, storeUrl, isLoggedIn, isUser } = require('../utils/middleware');

function getPath(pageName) {
    let tempPath = "C:\\Users\\Lenovo\\Desktop\\Coding Panda";
    let newPath = tempPath + "\\views\\" + pageName + ".html";
    return newPath;
}

const passportAuthenticate = passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' });

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
        const newUser = await userModel.register(userData, password);
        req.login(newUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered');
            res.redirect("/register");
        });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/register");
    }
}));

router.get('/login', asyncError(async (req, res) => {
    res.render('login');
}));

router.post('/login', storeUrl, passportAuthenticate, asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    // console.log("new: ", res.locals.returnUrl);
    const redirectUrl = res.locals.returnUrl || "/webdev";
    res.redirect(redirectUrl);
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

router.get('/instructor', asyncError(async (req, res) => {
    res.render('instructor');
}));

router.post('/instructor', validateInstructorSchema, asyncError(async (req, res) => {
    try {
        const { instructorName, instructorTitle, email, description } = req.body;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        const result = await newData.save();
        req.flash('success', 'Successfully Added Instructor');
        res.redirect("/instructor");
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/instructor");
    }
}));

router.get('/profile/:userId', isLoggedIn, isUser, asyncError(async (req, res) => {
    const userId = req.params.userId;
    const userData = await userModel.findById(userId);
    res.render('profile2', { userData: userData });
}));

router.get('/profileEdit/:userId', isLoggedIn, isUser, asyncError(async (req, res) => {
    const userId = req.params.userId;
    const userData = await userModel.findById(userId);
    res.render("editUser", { userData: userData });
}));

router.put('/profileUpdate/:userId', isLoggedIn, isUser, asyncError(async (req, res) => {
    try {
        const userId = req.params.userId;
        const userData = await userModel.findByIdAndUpdate(userId, { ...req.body });
        req.flash('success', 'Successfully Added Instructor');
        res.redirect(`/profile/${userId}`);
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect(`/profile/${userId}`);
    }
}));

module.exports = router;