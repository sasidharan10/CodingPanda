const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolledCoursesSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'course'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    duration: {
        type: Number,
        required: [true, "Number is required"],
        default: 0
    },
    progress: {
        type: Number,
        required: [true, "Number is required"],
        default: 0
    },
    timestamp: {
        type: Number,
        required: [true, "Timestamp Title is required"],
        default: 0
    }
});

module.exports = mongoose.model("enroll", enrolledCoursesSchema);