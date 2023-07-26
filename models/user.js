const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/', {useNewUrlParser: true,
// useCreateIndex: true,
// useUnifiedTopology: true});

const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is mandatory"]
    },
    score: {
        type: Number,
        required: true
    }, review: {
        type: String,
        required: true
    }
});

const fruitModel = mongoose.model("Fruit", fruitSchema);  // (collection_name, Schema)