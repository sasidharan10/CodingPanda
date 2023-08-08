const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructorSchema = new Schema({
    instructorName: {
        type: String,
        required: [true, "Instructor Name is required"]
    },
    email: {
        type: String,
        required: [true, "E-Mail is required"],
        unique: [true, "E-Mail already Exists!!!"]
    },
    instructorTitle: {
        type: String,
        required: [true, "Instructor Title is required"]
    },
    description: {
        type: String,
        required: [true, "Instructor description is required"]
    }
});

instructorSchema.index({ email: 1 });

instructorSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error("E-Mail already Exists!!!"));
    } else {
        next();
    }
});

const instructorModel = mongoose.model("instructor", instructorSchema);

module.exports = instructorModel;