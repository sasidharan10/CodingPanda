const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCourseSchema = new Schema({
    enrolledCourses: [{
        type: Schema.Types.ObjectId,
        ref: 'course'
    }],
    progress: {
        type: Number,
        required: [true, "Number is required"]
    },
    timestamp: {
        type: Number,
        required: [true, "Timestamp Title is required"]
    }
});

module.exports = mongoose.model("userCourse", userCourseSchema);