const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"]
    },
    instructor: {
        type: String,
        required: [true, "Instructor Title is required"]
    },
    link: {
        type: String,
        required: [true, "title is required"]
    },
    description: {
        type: String,
        required: [true, "Instructor description is required"]
    }
});

module.exports = mongoose.model("course", courseSchema);