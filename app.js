const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();

const expressEjsLayout = require('express-ejs-layouts')
const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');
require("./config/passport")(passport);

const url = 'mongodb+srv://root:pw1234@cluster0.zxwaj.mongodb.net/userdb?retryWrites=true&w=majority';
const methodOverride = require('method-override');
//mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
   .then(() => console.log('연결 완료!'))
   .catch((err) => console.log(err));

//ejs
app.set('view engine', 'ejs');
app.use(expressEjsLayout);

//static file
app.use("/public", express.static(__dirname +'/public'));

//body-parser
app.use(express.urlencoded({ extended: false }));

app.use(methodOverride('_method'));

//express session
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

//flash message
app.use(flash());
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();
})

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));

app.listen(3000); 