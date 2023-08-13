require('dotenv').config();
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require('passport');
const joi = require('joi');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const instructorModel = require("./models/instructorModel");
const userModel = require("./models/userModel");
const adminModel = require("./models/adminModel");
const courseModel = require("./models/courseModel");

const { Errorhandler, asyncError } = require('./utils/errorHandler');
const { isLoggedIn } = require('./utils/middleware');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const host = "127.0.0.1";
const port = process.env.PORT || 5000;  // hosting step 1
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

// EXPRESS SPECIFIC STUFFS
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const secret = process.env.SECRET || 'mypetbirdnameisunknown!';

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use("user", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, userModel.authenticate()));

passport.use("admin", new LocalStrategy(adminModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

passport.serializeUser(adminModel.serializeUser());
passport.deserializeUser(adminModel.deserializeUser());

const pt = path.join(__dirname, "views/");

function getPath(newPath) {
    let np = path.join(__dirname, "views", newPath);
    np = np + ".html";
    return np;
}

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    previousRoute = req.path;
    next();
});

app.use('/', userRoutes);
app.use('/', adminRoutes);

app.get('/', asyncError(async (req, res) => {
    res.render('home');
}));

app.get('/about', asyncError(async (req, res) => {
    const instructorData = await instructorModel.find({});
    res.render('about', { instructorData: instructorData });
}));

app.get('/courses', asyncError(async (req, res) => {
    const coursesData = await courseModel.find({}).populate("instructor");
    res.render('courses', { coursesData: coursesData });
}));

app.get('/desc', asyncError(async (req, res) => {
    // const coursesData = await courseModel.find({}).populate("instructor");
    res.render('courseDescription');
}));


app.get('/courses/:courseId', asyncError(async (req, res) => {
    const courseId = req.params.courseId;
    const courseData = await courseModel.findById(courseId).populate("instructor");
    res.render('courseDescription', { courseData: courseData });
    // res.send(courseData);
}));

app.get('/webdev', isLoggedIn, (req, res) => {
    res.render('webdev');
});


// app.get('/fakeUser', async (req, res) => {
//     const user = new userModel({ email: 'colt@gmail. com' });
//     const newUser = await userModel.register(user, 'chicken');
//     res.send(newUser);
// });

app.all('*', (req, res, next) => {
    next(new Errorhandler("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    err.statusCode = statusCode;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render("error", { err });
});


app.listen(port, () => {
    console.log(`The application started successfully at : http://${host}:${port}`);
});
