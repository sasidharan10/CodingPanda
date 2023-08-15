const mongoose = require('mongoose');
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

module.exports = mongoose.model("course", courseSchema);