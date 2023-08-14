const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const adminSchema = new Schema({
    role: {
        type: String,
        default: 'admin',
        get: v => 'admin'
    }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("admin", adminSchema);