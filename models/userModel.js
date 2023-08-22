const mongoose = require('mongoose');
const _ = require('lodash');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: [true, "E-Mail is required"]
    },
    role: {
        type: String,
        default: 'user',
        get: v => 'user'
    },
    college: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    leetcode: {
        type: String,
        default: ''
    },
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'enroll'
    }]
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email'],
});

userSchema.pre('save', function (next) {
    this.firstName = _.startCase(this.firstName);
    this.lastName = _.startCase(this.lastName);
    next();
});

userSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.firstName)
        update.firstName = _.startCase(update.firstName);
    if (update.lastName)
        update.lastName = _.startCase(update.lastName);
    if (update.college)
        update.college = _.map(_.split(update.college, /\s+/), _.capitalize).join(' ');
    if (update.country)
        update.country = _.startCase(update.country);
    next();
});

const userModel = mongoose.model("User", userSchema);  // (collection_name, Schema)

module.exports = userModel;