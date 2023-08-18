const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const adminModel = require("../models/adminModel");
const instructorModel = require("../models/instructorModel");
const courseModel = require("../models/courseModel");
const { getVideoData } = require("../utils/videoData");

const { asyncError } = require('../utils/errorHandler');

const { validateAdminSchema, validateInstructorSchema, validateCourseSchema, isLoggedInAdmin } = require('../utils/middleware');

const passportAdminAuthenticate = passport.authenticate('admin', { failureFlash: true, failureRedirect: '/admin' });





router.get('/adminHome', asyncError(async (req, res) => {
    console.log("user: ", req.user);
    res.render('admin/adminHome');
}));

router.get('/admin', asyncError(async (req, res) => {
    res.render('admin/adminLogin');
}));

router.post('/adminLogin', passportAdminAuthenticate, asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    res.redirect("/adminHome");
}));

router.get('/adminRegister', asyncError(async (req, res) => {
    res.render('admin/adminRegister');
}));

router.post('/adminRegister', validateAdminSchema, asyncError(async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminData = new adminModel({ username });
        const newAdmin = await adminModel.register(adminData, password);
        req.flash('success', 'Successfully Registered');
        res.redirect("/adminRegister");
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/adminRegister");
    }
}));

router.get('/addInstructor', asyncError(async (req, res) => {
    res.render('admin/addInstructor');

}));

router.post('/addInstructor', validateInstructorSchema, asyncError(async (req, res) => {
    try {
        const { instructorName, instructorTitle, email, description } = req.body;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        const result = await newData.save();
        req.flash('success', 'Successfully Added Instructor');
        res.redirect("/addInstructor");
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/addInstructor");
    }
}));

router.get('/viewCourses', asyncError(async (req, res) => {
    const coursesData = await courseModel.find({}).populate("instructor");
    res.render('admin/viewCourses', { coursesData: coursesData });
}));

router.get('/addCourse', isLoggedInAdmin, asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({});
    res.render('admin/addCourse', { instructorData: instructorData });
}));

router.post('/deleteCourse/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    try {
        await courseModel.findByIdAndDelete(courseId);
        req.flash('success', 'Successfully Deleted the Course');
        res.redirect('/viewCourses');
    } catch (error) {
        req.flash('error', "Erro while deleting the Course");
        res.redirect("/viewCourses");
    }
}));

router.post('/addCourse', validateCourseSchema, asyncError(async (req, res) => {
    const { courseTitle, instructor, videoId, description, summary, techStack } = req.body;
    const techArray = techStack.split(',');
    let dt = { duration: "", thumbnail: "" };
    try {
        dt = await getVideoData(videoId);
    } catch (error) {
        req.flash('error', "Youtube video ID doesn't exists, Please provide Valid Video ID");
        res.redirect("/addCourse");
    }
    const newCourse = new courseModel({
        courseTitle: courseTitle,
        videoId: videoId,
        instructor: instructor,
        duration: dt.duration,
        description: description,
        summary: summary,
        techStack: techArray,
        thumbnail: dt.thumbnail
    });
    const result = await newCourse.save();
    req.flash('success', 'Successfully Added New Course');
    res.redirect("/addCourse");
}));

module.exports = router;