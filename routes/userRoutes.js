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

// router.get('/fakeUser', asyncError(async (req, res) => {
//     const dt = await enrollCourseModel.find({ course: "64de2294585d860f9a172f79" });
//     res.send(dt);
// }));


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
            path: "course", populate: {
                path: "instructor"
            }
        });
        coursesData.push(course);
    }
    res.render('enrolledCourses', { coursesData: coursesData });
}));

router.get('/enrollCourse/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const getCourse = await courseModel.findById(courseId);
    const totalTime = getCourse.duration.hours * 3600 + getCourse.duration.minutes * 60 + getCourse.duration.seconds;
    const newEnroll = new enrollCourseModel({
        course: courseId,
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
            const getUser = await userModel.findById(userId);
            getUser.enrolledCourses.push(newEnroll._id);
            await getUser.save();     // saving courseId in user
            getCourse.users.push(userId);
            const finalResult = await getCourse.save();   // saving userId in course
            req.flash('success', 'Successfully Enrolled the Course');
            res.redirect('/courses');
        } catch (error) {
            req.flash('error', error.message);
            res.redirect(`/courses`);
        }
    }
}));

router.get('/unenrollCourse/:enrollId', asyncError(async (req, res) => {
    const enrollId = req.params.enrollId;
    const courseId = enrollId.course;
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

router.post("/saveProgress", async (req, res) => {
    const tm = req.body.timestamp;
    const eid = req.body.enrollId;
    const enrollData = await enrollCourseModel.findById(eid);
    enrollData.progress = Math.round((tm / enrollData.duration) * 100);
    enrollData.timestamp = tm;
    // console.log(enrollData);
    // const data = await timeModel.findById("64cf582f689d3cc5a53c6c04");
    // data.time = tm;
    const result = await enrollData.save();
    // console.log(result);
});


module.exports = router;