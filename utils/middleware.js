const { Errorhandler } = require('./errorHandler');
const { userSchema, instructorSchema, editUserSchema, adminSchema } = require('./schemaValidation');
const userModel = require("../models/userModel");

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnUrl = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.alreadyLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('success', 'Already Logged In');
        return res.redirect("/");
    }
    next();
}

module.exports.isUser = async (req, res, next) => {
    const { userId } = req.params;
    const data = await userModel.findById(userId);
    if (!data._id.equals(req.user._id)) {
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

module.exports.validateEditUserSchema = (req, res, next) => {
    const { error } = editUserSchema.validate(req.body);
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

module.exports.validateAdminSchema = (req, res, next) => {
    const { error } = adminSchema.validate(req.body);
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