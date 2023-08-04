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


const Errorhandler = require('./utils/errorHandler');
const asyncError = require('./utils/asyncErrorHandler');

const userModel = require("./models/userModel");
const userRoutes = require('./routes/userRoutes');
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

app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: true }));


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
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

const pt = path.join(__dirname, "views/");

function getPath(newPath) {
    let np = path.join(__dirname, "views", newPath);
    np = np + ".html";
    return np;
}

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);

app.get('/', asyncError(async (req, res) => {
    res.render('home');
}));

app.get('/about', (req, res) => {
    res.sendFile(getPath("about"));
});

app.get('/courses', (req, res) => {
    res.render('courses');
});

app.get('/webdev', (req, res) => {
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
