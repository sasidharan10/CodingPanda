const express = require('express');
const router = express.Router({ mergeParams: true });

const { asyncError } = require('../utils/errorHandler');

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
    res.render('courses', { coursesData: coursesData });
}));

router.get('/courses/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const courseData = await courseModel.findById(courseId).populate("instructor");
    res.render('courseDescription', { courseData: courseData });
}));

router.get('/coursePage/:courseId', isLoggedInUser, asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const courseData = await courseModel.findById(courseId).populate("instructor");
    res.render('coursePage', { courseData: courseData });
}));

module.exports = router;