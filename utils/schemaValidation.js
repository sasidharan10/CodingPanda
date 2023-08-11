const Joi = require('joi');

const validateWordCount = (value, helpers) => {
    const wordCount = value.trim().split(/\s+/).length;
    const key = helpers.state.path[0]; // Get the field name
    const errorMessage = `${key} should have 30 - 50 words`;

    if (wordCount >= 30 && wordCount <= 50) {
        return value; // Value is valid
    } else {
        return helpers.error('any.invalid', { message: errorMessage });
    }
};

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
    college: Joi.string().allow('').alphanum(),
    country: Joi.string().allow('').regex(/^[A-Za-z]+$/).message('Country should only include alphabetic characters'),
    github: Joi.string().allow('').alphanum(),
    leetcode: Joi.string().allow('').alphanum()
});

module.exports.instructorSchema = Joi.object({
    instructorName: Joi.string().required().regex(/^[A-Za-z]+$/).message('Name should only include alphabetic characters'),
    instructorTitle: Joi.string().required().regex(/^[A-Za-z]+$/).message('Title should only include alphabetic characters'),
    email: Joi.string().required().email(),
    description: Joi.string().required().custom(validateWordCount).message('Description should contain 30 - 50 words')
});