const mongoose = require('mongoose');
const _ = require('lodash');
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

instructorSchema.pre('save', function (next) {
    this.instructorName = _.startCase(this.instructorName);
    this.instructorTitle = _.startCase(this.instructorTitle);
    next();
});

instructorSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    update.instructorName = _.startCase(update.instructorName);
    update.instructorTitle = _.startCase(update.instructorTitle);
    next();
});

instructorSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error("E-Mail already Exists!!!"));
    } else {
        next();
    }
});

const instructorModel = mongoose.model("instructor", instructorSchema);

module.exports = instructorModel;