const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewBody: {
        type: String,
        required: [true, "Review is required"]
    },
    rating: {
        type: Number,
        required: [true, "rating is required"]
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("review", reviewSchema);

