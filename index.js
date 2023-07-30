require('dotenv').config();
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const userModel = require("./models/user");
const userRoutes = require('./routes/users');
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
app.use('/', userRoutes);

const secret = process.env.SECRET || 'mypetbirdnameisunknown!';

const sessionConfig = {
    name: 'session',
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(userModel.authenticate()));

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/courses', (req, res) => {
    res.render('courses');
});

app.get('/fakeUser', async (req, res) => {
    const user = new userModel({ email: 'colt@gmail. com' });
    const newUser = await userModel.register(user, 'chicken');
    res.send(newUser);
});


// app.get('/join', (req, res) => {
//     res.render(__dirname + '/views/join.html');
// });

// storing data in DB

// app.post('/join', (req, res) => {
//     var mydata = new model({
//         name: req.body.name,
//         phone: req.body.phone,
//         email: req.body.email,
//         address: req.body.address,
//         course: req.body.course,
//     });
//     mydata.save((err,data)=>{
//         if(err) throw err;
//         fullData.exec((err, data) => {
//             if(err) throw err;
//             res.render(__dirname + '/views/join.html', { message:'success' });
//         })
//     })
// });



// old code




// app.post('/join', (req, res) => {
//     var mydata = new model(req.body);
//     mydata.save().then(() => {
//         res.status(200).render(__dirname + '/views/join.html', { message: 'success' });
//     }).catch(() => {
//         res.status(404).render(__dirname + '/views/join.html', { message: 'failed' });
//     })
// });

// // showing data

// app.get('/student', (req, res) => {
//     fullData.exec((err, data) => {
//         if (err) throw err;
//         res.render(__dirname + '/views/student.html', { record: data,message:''});
//     })
// });

// // deleting data

// app.get('/delete/:id', (req, res) => {
//     let id = req.params.id;
//     var del = model.findByIdAndDelete(id);
//     del.exec((err, data1) => {
//         if (err) throw err;
//         // console.log(data1);
//         // console.log("data1 over");
//         fullData.exec((err, data2) => {
//             if (err) throw err;
//             // console.log(data2);
//             res.render(__dirname + '/views/student.html', { record: data2,message:'deleted' });
//         })
//     })
// });

// // updating data

// app.get('/edit/:id', (req, res) => {
//     let id = req.params.id;
//     let edit = model.findById(id);
//     edit.exec((err, data) => {
//         if (err) throw err;
//         res.render(__dirname + '/views/edit.html', { record: data });
//     })

// });

// app.post('/update', (req, res) => {
//     let id = req.body.id;
//     let update = model.findByIdAndUpdate(id, {
//         name: req.body.name,
//         phone: req.body.phone,
//         email: req.body.email,
//         address: req.body.address,
//         course: req.body.course,
//     });
//     update.exec((err,data1) => {
//         if (err) throw err;
//         // console.log(data1);
//         // console.log("data1 over");
//         fullData.exec((err, data2) => {
//             // console.log(data2);
//             if (err) throw err;
//             res.render(__dirname + '/views/student.html', { record: data2,message:'updated' });
//         })
//     })

// });


app.listen(port, () => {
    console.log(`The application started successfully at : http://${host}:${port}`);
});
