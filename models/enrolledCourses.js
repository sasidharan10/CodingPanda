const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const enrolledCoursesSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'course'
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

module.exports = mongoose.model("enrolled", enrolledCoursesSchema);