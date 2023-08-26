const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');

const adminModel = require("../models/adminModel");
const instructorModel = require("../models/instructorModel");
const courseModel = require("../models/courseModel");
const userModel = require('../models/userModel');
const enrolledCoursesModel = require('../models/enrolledCourses');

const { getVideoData } = require("../utils/videoData");
const { asyncError } = require('../utils/errorHandler');
const { validateAdminSchema, validateInstructorSchema, validateCourseSchema, isLoggedInAdmin, storeUrl } = require('../utils/middleware');

const passportAdminAuthenticate = passport.authenticate('admin', { failureFlash: true, failureRedirect: '/admin' });

// router.get('/fake', asyncError(async (req, res) => {
//     res.send(userData);
// }));

router.get('/adminHome', asyncError(async (req, res) => {
    const userCount = await userModel.countDocuments();
    const courseCount = await courseModel.countDocuments();
    const instructorCount = await instructorModel.countDocuments();
    res.render('admin/adminHome', { userCount, instructorCount, courseCount });
}));

router.get('/admin', asyncError(async (req, res) => {
    res.render('admin/adminLogin');
}));

router.post('/adminLogin', passportAdminAuthenticate, asyncError(async (req, res) => {
    req.flash('success', 'Successfully Logged In');
    res.redirect("/adminHome");
}));

router.get('/adminLogout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Successfully Logged out!");
        res.redirect('/admin');
    });
});

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
    req.session.prevUrl = req.session.prevRoute;
    res.render('admin/addInstructor');
}));

router.post('/addInstructor', storeUrl, validateInstructorSchema, asyncError(async (req, res) => {
    try {
        let redirectUrl = "/viewInstructors";
        if (req.session.prevUrl && req.session.prevUrl === '/addCourse') {
            redirectUrl = '/addCourse';
        }
        const { instructorName, instructorTitle, email, description } = req.body;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        await newData.save();
        req.flash('success', 'Successfully Added Instructor');
        res.redirect(redirectUrl);
    }
    catch (error) {
        req.flash('error', error.message);
        res.redirect("/viewInstructors");
    }
}));

router.get('/viewInstructors', asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({}).populate('courses');
    res.render('admin/viewInstructors', { instructorData: instructorData });
}));

router.get('/editInstructor/:instructorId', asyncError(async (req, res) => {
    const instructorId = req.params.instructorId;
    try {
        const instructorData = await instructorModel.findById(instructorId);
        res.render('admin/editInstructor', { instructorData: instructorData });
    } catch (error) {
        req.flash('error', "Error while redirecting to Edit Instructor");
        res.redirect("/viewInstructors");
    }
}));

router.put('/UpdateInstructor/:instructorId', asyncError(async (req, res) => {
    const instructorId = req.params.instructorId;
    try {
        await instructorModel.findByIdAndUpdate(instructorId, { ...req.body });
        req.flash('success', 'Successfully Updated Instructor Data');
        res.redirect('/viewInstructors');
    } catch (error) {
        req.flash('error', "Erro while Updating Instructor data");
        res.redirect("/viewInstructors");
    }
}));

router.delete('/deleteInstructor/:instructorId', asyncError(async (req, res) => {
    const instructorId = req.params.instructorId;
    try {
        const instructorData = await instructorModel.findById(instructorId);
        if (instructorData.courses.length !== 0) {
            req.flash('error', "You cannot delete this Instructor, who is enrolled as an Instructor in a course! Either Delete those courses or update those courses with new Instructors, Before deleting this Instructor.");
            res.redirect("/viewInstructors");
            return;
        }
        await instructorModel.findByIdAndDelete(instructorId);
        req.flash('success', 'Successfully Deleted the Instructor');
        res.redirect('/viewInstructors');
    } catch (error) {
        req.flash('error', "Error while deleting the Instructor data");
        res.redirect("/viewInstructors");
    }
}));

router.get('/viewCourses', asyncError(async (req, res) => {
    const coursesData = await courseModel.find({}).populate("instructor");
    res.render('admin/viewCourses', { coursesData: coursesData });
}));

router.get('/addCourse', storeUrl, asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({});
    res.render('admin/addCourse', { instructorData: instructorData });
}));

router.post('/addCourse', validateCourseSchema, asyncError(async (req, res) => {
    const { courseTitle, instructor, videoId, description, summary, techStack } = req.body;
    let dt = { duration: "", thumbnail: "" };
    try {
        dt = await getVideoData(videoId);
    } catch (error) {
        req.flash('error', "Youtube video ID doesn't exists, Please provide Valid Video ID");
        res.redirect("/addCourse");
        return;
    }
    const newCourse = new courseModel({
        courseTitle: courseTitle,
        videoId: videoId,
        instructor: instructor,
        duration: dt.duration,
        description: description,
        summary: summary,
        techStack: techStack.split(','),
        thumbnail: dt.thumbnail
    });
    try {
        const coursesData = await newCourse.save();
        const instructorData = await instructorModel.findById(instructor);
        instructorData.courses.push(coursesData._id);
        await instructorData.save();
        req.flash('success', 'Successfully Added New Course');
        res.redirect("/viewCourses");
    } catch (error) {
        req.flash('error', error.message);
        res.redirect("/addCourse");
    }
}));

router.get('/editCourse/:courseId/', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    try {
        const coursesData = await courseModel.findById(courseId).populate('instructor');
        const instructorData = await instructorModel.find({});
        res.render('admin/editCourse', { coursesData: coursesData, instructorData: instructorData });
    } catch (error) {
        req.flash('error', "Error while redirecting to Edit Course");
        res.redirect("/viewCourses");
    }
}));

router.put('/UpdateCourse/:courseId/:instructorId', validateCourseSchema, asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const oldInstructor = req.params.instructorId;
    const newInstructor = req.body.instructor;
    req.body.techStack = req.body.techStack.split(',');
    let dt = { duration: "", thumbnail: "" };
    try {
        dt = await getVideoData(req.body.videoId);
    } catch (error) {
        req.flash('error', "Youtube video ID doesn't exists, Please provide Valid Video ID");
        res.redirect("/addCourse");
        return;
    }
    req.body.duration = dt.duration;
    req.body.thumbnail = dt.thumbnail;
    try {
        await instructorModel.findByIdAndUpdate(oldInstructor, { $pull: { courses: courseId } });
        await courseModel.findByIdAndUpdate(courseId, { ...req.body });
        await instructorModel.findByIdAndUpdate(newInstructor, { $push: { courses: courseId } });
        req.flash('success', 'Successfully Updated the Course');
        res.redirect('/viewCourses');
    } catch (error) {
        req.flash('error', "Error while Updating the Course");
        res.redirect("/viewCourses");
    }
}));

router.delete('/deleteCourse/:courseId/:instructorId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const instructorId = req.params.instructorId;
    try {
        const enrollData = await enrolledCoursesModel.find({ course: courseId });
        let enrollArray = [];
        for (const it of enrollData) {
            enrollArray.push(it._id);
        }
        await userModel.updateMany({ $pull: { enrolledCourses: { $in: enrollArray } } });
        await instructorModel.findByIdAndUpdate(instructorId, { $pull: { courses: courseId } });
        await enrolledCoursesModel.deleteMany({ course: courseId });
        await courseModel.findByIdAndDelete(courseId);
        req.flash('success', 'Successfully Deleted the Course');
        res.redirect('/viewCourses');
    } catch (error) {
        req.flash('error', "Error while deleting the Course");
        res.redirect("/viewCourses");
    }
}));

router.get('/viewUsers', asyncError(async (req, res) => {
    const userData = await userModel.find({});
    res.render('admin/viewUsers', { userData: userData });
}));

router.delete('/deleteUser/:userId', asyncError(async (req, res) => {
    const userId = req.params.userId;
    try {
        await courseModel.updateMany({ $pull: { users: { $in: userId } } });
        await enrolledCoursesModel.deleteMany({ user: userId });
        await userModel.findByIdAndDelete(userId);
        req.flash('success', 'Successfully Deleted the User');
        res.redirect('/viewUsers');
    } catch (error) {
        req.flash('error', "Error while deleting the User data");
        res.redirect("/viewUsers");
    }
}));

module.exports = router;