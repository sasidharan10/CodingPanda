const Joi = require('joi');

const validateWordCount = (mn, mx) => {
    return (value, helpers) => {
        const wordCount = value.trim().split(/\s+/).length;
        const key = helpers.state.path[0]; // Get the field name
        const errorMessage = `${key} should have 30 - 50 words`;
        if (wordCount >= mn && wordCount <= mx) {
            return value; // Value is valid
        } else {
            return helpers.error('any.invalid', { message: errorMessage });
        }
    }
}

module.exports.userSchema = Joi.object({
    firstName: Joi.string().required().regex(/^[A-Za-z]+$/).message('First Name should only include alphabetic characters'),
    lastName: Joi.string().allow('').regex(/^[A-Za-z]+$/).message('Last Name should only include alphabetic characters'),
    email: Joi.string().required().email(),
    password: Joi.string().required()
});

module.exports.editUserSchema = Joi.object({
    firstName: Joi.string().required().regex(/^[A-Za-z]+$/).message('First Name should only include alphabetic characters'),
    lastName: Joi.string().allow('').regex(/^[A-Za-z]+$/).message('Last Name should only include alphabetic characters'),
    email: Joi.string().required().email(),
    college: Joi.string().allow(''),
    country: Joi.string().allow('').regex(/^[A-Za-z]+$/).message('Country should only include alphabetic characters'),
    github: Joi.string().allow('').alphanum(),
    leetcode: Joi.string().allow('').alphanum()
});

module.exports.instructorSchema = Joi.object({
    instructorName: Joi.string().required().regex(/^[A-Za-z]+$/).message('Name should only include alphabetic characters'),
    instructorTitle: Joi.string().required().regex(/^[A-Za-z]+$/).message('Title should only include alphabetic characters'),
    email: Joi.string().required().email(),
    description: Joi.string().required().custom(validateWordCount(30, 50)).message('Description should contain 30 - 50 words')
});

module.exports.adminSchema = Joi.object({
    username: Joi.string().required().regex(/^[A-Za-z]+$/).message('Username should only include alphabetic characters'),
    password: Joi.string().required()
});

module.exports.courseSchema = Joi.object({
    courseTitle: Joi.string().required().min(5).max(50),
    instructor: Joi.string().required().hex().length(24),
    videoId: Joi.string().required().pattern(/^[a-zA-Z0-9_-]{11}$/).message("Youtube video ID is WRONG, please provide valid ID"),
    description: Joi.string().required().custom(validateWordCount(20, 40)).message('Description should contain 20 - 40 words'),
    summary: Joi.string().required().custom(validateWordCount(10, 20)).message('Summary should contain 10 - 20 words'),
    techStack: Joi.string().required()
});
