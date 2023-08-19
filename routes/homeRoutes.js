const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const { asyncError } = require('../utils/errorHandler');

const userModel = require("../models/userModel");
const courseModel = require("../models/courseModel");
const instructorModel = require("../models/instructorModel");

const { isLoggedInUser } = require('../utils/middleware');


router.get('/', asyncError(async (req, res) => {
    res.render('home');
}));

router.get('/about', asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({});
    res.render('about', { instructorData: instructorData });
}));

router.get('/courses', asyncError(async (req, res) => {
    const coursesData = await courseModel.find({}).populate("instructor");
    if (!req.isAuthenticated()) {
        res.render('courses', { coursesData: coursesData });
    }
    else {
        const userId = req.user._id;
        const userData = await userModel.findById(userId).populate("enrolledCourses");
        const alreadyEnrolled = userData.enrolledCourses;
        res.render('courses', { coursesData: coursesData, alreadyEnrolled: alreadyEnrolled });
    }
}));

router.get('/courses/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const courseData = await courseModel.findById(courseId).populate("instructor");
    if (!req.isAuthenticated()) {
        res.render('courseDescription', { courseData: courseData });
    }
    else {
        const userId = req.user._id;
        const userData = await userModel.findById(userId).populate("enrolledCourses");
        const isEnrolled = userData.enrolledCourses.find((temp) => temp.course.equals(courseId));
        res.render('courseDescription', { courseData: courseData, isEnrolled: isEnrolled });
    }
}));

router.get('/coursePage/:courseId', isLoggedInUser, asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const userId = req.user._id;
    const userData = await userModel.findById(userId).populate({
        path: "enrolledCourses", populate: {
            path: "course",
            populate: {
                path: "instructor"
            }
        }
    });
    const courseData = userData.enrolledCourses.find((temp) => temp.course.equals(new ObjectId(courseId)));
    res.render('coursePage', { courseData: courseData.course, enrollData: courseData });
}));

module.exports = router;