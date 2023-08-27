const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
    // console.log(res.locals.prevRoute);
    // console.log(res.locals.returnUrl);
    console.log(req.session.returnTo);
    let redirectUrl = req.session.returnTo || "/";
    delete req.session.returnTo;
    // if (req.session.prevUrl) {
    //     redirectUrl = req.session.prevUrl;
    // }
    // const redirectUrl = res.locals.returnUrl || "/";
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
    const userId = req.params.userId;
    try {
        await userModel.findByIdAndUpdate(userId, { ...req.body });
        req.flash('success', 'Successfully Updated Your Profile');
        res.redirect(`/profile/${userId}`);
    }
    catch (error) {
        req.flash('error', error.message);
        return res.redirect(`/profile/${userId}`);
    }
}));

router.get('/enrolledCourses', isLoggedInUser, asyncError(async (req, res) => {
    const userId = req.user._id;
    const userData = await userModel.findById(userId);
    const coursesArray = userData.enrolledCourses;
    let coursesData = [];
    for (const it of coursesArray) {
        const course = await enrollCourseModel.findById(it).populate({
            path: "course", populate: {
                path: "instructor"
            }
        });
        coursesData.push(course);
    }
    res.render('enrolledCourses', { coursesData: coursesData });
}));

router.post('/enrollCourse/:courseId', isLoggedInUser, asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const getCourse = await courseModel.findById(courseId);
    const totalTime = getCourse.duration.hours * 3600 + getCourse.duration.minutes * 60 + getCourse.duration.seconds;
    const newEnroll = new enrollCourseModel({
        course: courseId,
        user: userId,
        duration: totalTime
    });
    const userData = await userModel.findById(userId).populate("enrolledCourses");
    const result = userData.enrolledCourses.find((temp) => temp.course.equals(new ObjectId(courseId)));
    if (result) {
        req.flash('error', 'You have already enrolled in this course');
        res.redirect('/courses');
    }
    else {
        try {
            await newEnroll.save();   // saving courseId in enroll
            userData.enrolledCourses.push(newEnroll._id);
            await userData.save();     // saving courseId in user
            getCourse.users.push(userId);
            await getCourse.save();   // saving userId in course
            req.flash('success', 'Successfully Enrolled the Course');
            res.redirect('/enrolledCourses');
        } catch (error) {
            req.flash('error', error.message);
            res.redirect(`/courses`);
        }
    }
}));

router.delete('/unenrollCourse/:enrollId', isLoggedInUser, asyncError(async (req, res) => {
    const enrollId = req.params.enrollId;
    const enrollData = await enrollCourseModel.findById(enrollId).populate('course');
    const courseId = enrollData.course._id;
    const userId = req.user._id;
    try {
        await userModel.findByIdAndUpdate(userId, { $pull: { enrolledCourses: enrollId } });
        await courseModel.findByIdAndUpdate(courseId, { $pull: { users: userId } });
        await enrollCourseModel.findByIdAndDelete(enrollId);
        req.flash('success', 'Successfully Unenrolled from the Course');
        res.redirect("/enrolledCourses");
    } catch (error) {
        req.flash('error', error.message);
        res.redirect(`/enrolledCourses`);
    }
}));

router.post("/saveProgress", isLoggedInUser, async (req, res) => {
    const tm = req.body.timestamp;
    const eid = req.body.enrollId;
    const enrollData = await enrollCourseModel.findById(eid);
    enrollData.progress = Math.round((tm / enrollData.duration) * 100);
    enrollData.timestamp = tm;
    await enrollData.save();
});

module.exports = router;