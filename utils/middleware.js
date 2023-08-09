const { Errorhandler } = require('./errorHandler');
const { userSchema } = require('./schemaValidation');
const { instructorSchema } = require('./schemaValidation');
const userModel = require("../models/userModel");

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isUser = async (req, res, next) => {
    const id = req.params.userId;
    const userId = await userModel.findById(id);
    if (!userId._id.equals(req.user._id)) {
        req.flash('error', 'You are not Authorized to view this page!');
        return res.redirect(`/login`);
    }
    next();
}

module.exports.validateUserSchema = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new Errorhandler(msg, 400);
    }
    else {
        next();
    }
}

module.exports.validateInstructorSchema = (req, res, next) => {
    const { error } = instructorSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new Errorhandler(msg, 400);
    }
    else {
        next();
    }
}

module.exports.storeUrl = (req, res, next) => {
    if (req.session.returnUrl)
        res.locals.returnUrl = req.session.returnUrl;
    next();
}


// req.session.returnTo = req.originalUrl