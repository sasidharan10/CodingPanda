require('dotenv').config()
const mongoose = require("mongoose");

const mongo_username = process.env.MONGO_UNAME;
const mongo_password = process.env.MONGO_PS;

mongoose.connect(`mongodb+srv://${mongo_username}:${mongo_password}@clouddatabase.xen9i.mongodb.net/dance?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
// mongoose.connect('mongodb://localhost:27017/dance?readPreference=primary&appname=MongoDB%20Compass', {useNewUrlParser: true, useUnifiedTopology: true});

// defining schema
const danceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    course: { type: String, required: true }
});

// compiling to a model
const joinDance = mongoose.model('joinDance', danceSchema);

module.exports = joinDance;