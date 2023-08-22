const mongoose = require('mongoose');
const _ = require('lodash');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseTitle: {
        type: String,
        required: [true, "title is required"]
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'instructor'
    },
    videoId: {
        type: String,
        required: [true, "Video Id is required"]
    },
    duration: {
        type: Schema.Types.Mixed,
        required: [true, "Duration is required"]
    },
    description: {
        type: String,
        required: [true, "Description description is required"]
    },
    summary: {
        type: String,
        required: [true, "Summary description is required"]
    },
    techStack: {
        type: Array,
        required: [true, "TechStack description is required"]
    },
    thumbnail: {
        type: String,
        required: [true, "Thumbnail description is required"]
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }]
});

courseSchema.pre('save', function (next) {
    this.courseTitle = _.map(_.split(this.courseTitle, /\s+/), _.capitalize).join(' ');
    next();
});

courseSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    if (update.courseTitle)
        update.courseTitle = _.map(_.split(update.courseTitle, /\s+/), _.capitalize).join(' ');
    next();
});

module.exports = mongoose.model("course", courseSchema);