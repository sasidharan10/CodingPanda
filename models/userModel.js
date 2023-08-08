const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String
    }, 
    email: {
        type: String,
        required: [true, "E-Mail is required"]
    },
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email'], // Allow querying user using 'email' instead of 'username'
});

const userModel = mongoose.model("User", userSchema);  // (collection_name, Schema)

module.exports = userModel;