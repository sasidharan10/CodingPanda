const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const axios = require('axios');

const adminModel = require("../models/adminModel");
const courseModel = require("../models/courseModel");

const { asyncError } = require('../utils/errorHandler');

const { validateAdminSchema } = require('../utils/middleware');

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
    const duration = videoDetails.contentDetails.duration;

    const thumbnail = thumbnails.high.url;

    console.log('High Thumbnail:', thumbnail);
    console.log('Duration:', duration);

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

router.get('/addCourse', asyncError(async (req, res) => {
    res.render('admin/addCourse');
}));

router.post('/addCourse', asyncError(async (req, res) => {
    const { courseTitle, instructor, videoId, description, summary, techStack } = req.body;
    const techArray = techStack.split(',');
    const { duration, thumbnail } = await getDuration(videoId);
    console.log('High Thumbnail:', thumbnail);
    console.log('Duration:', duration);
    const newCourse = new courseModel({
        courseTitle: courseTitle,
        instructor: instructor,
        videoId: videoId,
        duration: duration,
        description: description,
        summary: summary,
        techStack: techArray,
        thumbnail: thumbnail
    });
    res.send(newCourse);
    // res.render('admin/addCourse');
}));

module.exports = router;