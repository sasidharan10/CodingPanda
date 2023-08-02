const Joi = require('joi');

module.exports.userSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().allow(''),
    email: Joi.string().required().email(),
    password: Joi.string().required()
});