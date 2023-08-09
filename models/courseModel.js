const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    tutor: {
        type: Schema.Types.ObjectId,
        ref: 'instructor'
    },
    link: {
        type: String,
        required: [true, "title is required"]
    },
    duration: {
        type: Number,
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
    }
});

module.exports = mongoose.model("course", courseSchema);