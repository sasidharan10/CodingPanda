const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name is mandatory"]
    },
    lastName: {
        type: String
    }
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email', // Use the 'email' field for authentication instead of the 'username' field
    usernameQueryFields: ['email'], // Allow querying user using 'email' instead of 'username'
    passwordField: 'password'
  });

const userModel = mongoose.model("User", userSchema);  // (collection_name, Schema)

module.exports = userModel;