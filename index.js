require('dotenv').config();
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const LocalStrategyUser = require('passport-local');
const LocalStrategyAdmin = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const {dbUrl, port, secret, secureCookie} = require(`./config/${process.env.NODE_ENV || 'development'}`);

const userModel = require("./models/userModel");
const adminModel = require("./models/adminModel");

const { Errorhandler } = require('./utils/errorHandler');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const host = "127.0.0.1";

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
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig = {
    name: 'session',
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: secureCookie,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use("user", new LocalStrategyUser({
    usernameField: 'email',
    passwordField: 'password'
}, userModel.authenticate()));

passport.use("admin", new LocalStrategyAdmin({
    usernameField: 'username',
    passwordField: 'password'
}, adminModel.authenticate()));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (userSession, done) {
    let user;
    if (userSession.role === 'user') {
        user = {
            _id: userSession._id,
            firstName: userSession.firstName,
            lastName: userSession.lastName,
            email: userSession.email,
            role: userSession.role,
            college: userSession.college,
            country: userSession.country,
            github: userSession.github,
            leetcode: userSession.leetcode,
            enrolledCourses: userSession.enrolledCourses
        };
    } else if (userSession.role === 'admin') {
        user = {
            _id: userSession._id,
            username: userSession.username,
            role: userSession.role
        };
    }
    if (user != null)
        done(null, user);
});

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = null;
    res.locals.currentAdmin = null;
    // req.session.returnUrl = req.originalUrl;
    if (req.user && req.user.role === 'user')
        res.locals.currentUser = req.user;
    if (req.user && req.user.role === 'admin')
        res.locals.currentAdmin = req.user;

    if (!req.session.pathArray) {
        let tempArray = [];
        tempArray.push(req.path);
        req.session.pathArray = tempArray;
    }
    else if (req.session.pathArray.length === 1 && req.session.pathArray[0] != req.path) {
        req.session.pathArray[1] = req.path;
        req.session.prevRoute = req.session.pathArray[0];
    }
    else if (req.session.pathArray.length === 2) {
        req.session.pathArray[0] = req.session.pathArray[1];
        req.session.pathArray[1] = req.path;
        req.session.prevRoute = req.session.pathArray[0];
    }
    // console.log("path: ", req.session.pathArray);
    // console.log("prev: ", req.session.prevRoute);
    next();
});

app.use('/', homeRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);

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
    // console.log(`The application started successfully at : http://${host}:${port}`);
});
