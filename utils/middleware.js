const { Errorhandler } = require('./errorHandler');
const { userSchema } = require('./schemaValidation');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
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


// req.session.returnTo = req.originalUrl