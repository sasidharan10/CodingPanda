const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const axios = require('axios');

const adminModel = require("../models/adminModel");
const instructorModel = require("../models/instructorModel");
const courseModel = require("../models/courseModel");


const { asyncError } = require('../utils/errorHandler');

const { validateAdminSchema, validateInstructorSchema, storeUrl, prevRoute } = require('../utils/middleware');

const passportAuthenticate = passport.authenticate('admin', { failureFlash: true, failureRedirect: '/admin' });

async function getDuration(vidId) {
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
        params: {
            part: 'contentDetails,snippet', // Request both contentDetails and snippet parts
            id: vidId,
            key: process.env.YOUTUBE_KEY
        }
    });
    const videoDetails = result.data.items[0];
    const thumbnails = videoDetails.snippet.thumbnails;
    const rawDuration = videoDetails.contentDetails.duration;

    const match = rawDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
    const hrs = match[1] ? parseInt(match[1]) : 0;
    const mins = match[2] ? parseInt(match[2]) : 0;
    const secs = match[3] ? parseInt(match[3]) : 0;
    const duration = {
        hours: hrs,
        minutes: mins,
        seconds: secs
    }

    const thumbnail = thumbnails.high.url;

    // console.log('High Thumbnail:', thumbnail);
    // console.log('Duration:', duration);

    return { duration, thumbnail };

}



router.get('/adminHome', asyncError(async (req, res) => {
    res.render('admin/adminHome');
}));

router.get('/admin', asyncError(async (req, res) => {
    res.render('admin/adminLogin');
}));

router.post('/adminLogin', passportAuthenticate, asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    res.redirect("/adminHome");
}));

router.get('/adminRegister', asyncError(async (req, res) => {
    res.render('admin/adminRegister');
}));

router.post('/adminRegister', asyncError(async (req, res) => {
    try {
        const { username, password } = req.body;
        const adminData = new adminModel({ username });
        const newAdmin = await adminModel.register(adminData, password);
        req.flash('success', 'Successfully Registered');
        res.redirect("/adminRegister");
        // req.login(newAdmin, (err) => {
        //     if (err) return next(err);
        //     console.log(newAdmin);
        //     req.flash('success', 'Successfully Registered');
        //     res.redirect("/adminRegister");
        // });
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/register");
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

router.get('/addCourse', asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({});
    res.render('admin/addCourse', { instructorData: instructorData });
}));

router.post('/addCourse', asyncError(async (req, res) => {
    const { courseTitle, instructorId, videoId, description, summary, techStack } = req.body;
    const techArray = techStack.split(',');
    const { duration, thumbnail } = await getDuration(videoId);
    console.log('High Thumbnail:', thumbnail);
    console.log('Duration:', duration);
    const newCourse = new courseModel({
        courseTitle: courseTitle,
        videoId: videoId,
        instructor: instructorId,
        duration: duration,
        description: description,
        summary: summary,
        techStack: techArray,
        thumbnail: thumbnail
    });
    const result = await newCourse.save();
    req.flash('success', 'Successfully Added New Curse');
    res.redirect("/addCourse");
    // res.send(newCourse);f

}));

module.exports = router;