const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema();

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("admin", adminSchema);