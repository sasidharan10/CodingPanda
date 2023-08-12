const mongoose = require('mongoose');
const instructorData = require("./instructorData.json");
const coursesData = require("./coursesData.json");
const instructorModel = require("../models/instructorModel");
const courseModel = require("../models/courseModel");


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
    const temp = await instructorModel.deleteMany({});
    for (const iterator of instructorData) {
        const { instructorName, instructorTitle, email, description } = iterator;
        const newData = new instructorModel({ instructorName, instructorTitle, email, description });
        const result = await newData.save();
    }
    console.log("Added Instructor Data");
    mongoose.connection.close();

}

async function addCourseData() {
    const temp = await courseModel.deleteMany({});
    for (const iterator of coursesData) {
        const { courseTitle, instructor, videoId, duration, description, summary, techStack, thumbnail } = iterator;
        const newData = new courseModel({ courseTitle, instructor, videoId, duration, description, summary, techStack, thumbnail });
        const result = await newData.save();
    }
    console.log("Added Course Data");
    mongoose.connection.close();
}

// addInstructorData();
// addCourseData();