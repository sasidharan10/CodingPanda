const mongoose = require('mongoose');
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
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email'], // Allow querying user using 'email' instead of 'username'
});

const userModel = mongoose.model("User", userSchema);  // (collection_name, Schema)

module.exports = userModel;