const mongoose = require('mongoose');
const instructorData = require("./instructorData.json");
const instructorModel = require("../models/instructorModel");


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/cppDB';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

async function addInstructorData() {
    const temp = instructorModel.deleteMany({});
    for (const iterator of instructorData) {
        const { instructorName, instructorTitle, email, description } = iterator;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        const result = await newData.save();
    }
    console.log("Added Instructor Data");
}

async function addUserData() {
    const temp = instructorModel.deleteMany({});
    for (const iterator of instructorData) {
        const { instructorName, instructorTitle, email, description } = iterator;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        const result = await newData.save();
    }
    console.log("Added Instructor Data");
}

// addInstructorData();