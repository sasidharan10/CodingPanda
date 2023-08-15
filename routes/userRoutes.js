const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const enrollCourseModel = require("../models/enrolledCourses");

const { asyncError } = require('../utils/errorHandler');
const { validateUserSchema, validateEditUserSchema, alreadyLoggedIn, storeUrl, isLoggedInUser, isUser } = require('../utils/middleware');

const passportAuthenticate = passport.authenticate('user', { failureFlash: true, failureRedirect: '/login' });

router.get('/register', alreadyLoggedIn, asyncError(async (req, res) => {
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
            res.redirect("/");
        });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/register");
    }
}));

router.get('/login', alreadyLoggedIn, asyncError(async (req, res) => {
    res.render('login');
}));

router.post('/login', storeUrl, passportAuthenticate, asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    const redirectUrl = res.locals.returnUrl || "/";
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

router.get('/profile/:userId', isLoggedInUser, isUser, asyncError(async (req, res) => {
    const userId = req.params.userId;
    const userData = await userModel.findById(userId);
    res.render('profile', { userData: userData });
}));

router.get('/profileEdit/:userId', isLoggedInUser, isUser, asyncError(async (req, res) => {
    const userId = req.params.userId;
    const userData = await userModel.findById(userId);
    res.render("editUser", { userData: userData });
}));

router.put('/profileUpdate/:userId', isLoggedInUser, isUser, validateEditUserSchema, asyncError(async (req, res) => {
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

router.get('/enrolledCourses', asyncError(async (req, res) => {
    const userId = req.user._id;
    const userData = await userModel.findById(userId);
    const coursesArray = userData.enrolledCourses;
    let coursesData = [];
    for (const it of coursesArray) {
        const course = await enrollCourseModel.findById(it).populate({
            path: "courseId", populate: {
                path: "instructor"
            }
        });
        coursesData.push(course);
    }
    // res.send(coursesData);
    res.render('enrolledCourses', { coursesData: coursesData });
}));

router.get('/enrollCourse/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const newEnroll = new enrollCourseModel({
        courseId: courseId
    });
    try {
        await newEnroll.save();   // saving courseId in enroll
        const getUser = await userModel.findById(userId);
        getUser.enrolledCourses.push(newEnroll._id);
        await getUser.save();     // saving courseId in user
        const getCourse = await courseModel.findById(courseId);
        getCourse.users.push(userId);
        const finalResult = await getCourse.save();   // saving userId in course
        req.flash('success', 'Successfully Enrolled the Course');
        res.redirect('/courses');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses`);
    }
}));

router.get('/deleteCourse/:enrollId', asyncError(async (req, res) => {
    const enrollId = req.params.enrollId;
    const courseId = enrollId.courseId;
    const userId = req.user._id;
    try {
        const getUser = await userModel.findByIdAndUpdate(userId, { $pull: { enrolledCourses: enrollId } });
        const getCourse = await courseModel.findByIdAndUpdate(courseId, { $pull: { users: userId } });
        const getEnroll = await enrollCourseModel.findByIdAndDelete(enrollId);
        req.flash('success', 'Successfully Deleted the Course');
        res.redirect("/enrolledCourses");
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/courses`);
    }
}));


module.exports = router;