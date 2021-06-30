var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session); // in order to use filestore app, we need 
// to return function to a function, so we have 2 parameters here
const passport = require('passport');
const config = require('./config');
// const authenticate = require('./authenticate');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

// const url = 'mongodb://localhost:27017/nucampsite';
const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log(`Connected correctly to server`),
  err => console.log(err));  // this is a different way of handling error besides .catch(err....)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // we will not use cookie if we are using express session, we can only use 1
// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,  //this means if the session is empty, we don't save it automatically
//   resave: false, // this means if we update the session, we don't resave it
//   store: new FileStore()  // to store the session into the harddisk of the computer
// }));


app.use(passport.initialize());
// app.use(passport.session());  // 2 middlewares, used only for if passport uses sessions

app.use('/', indexRouter);
app.use('/users', usersRouter);  // move these 2 code to here, before the authentication, 
// is because we want to use indexrouter before authentication, also we can use usersRouter to authenticate instead 

// remove below code so that we are not using authetication for the general path. The other authentication will be specified in campsiteRouter.js, etc
// function auth(req, res, next) {  // we add authentication before the static use because we want to authenticate before that
//   //if(!req.signedCookies.user) { // we don't need this line because we use session now
//   console.log(req.user); 
//   if(!req.user){
//     // const authHeader = req.headers.authorization;
//     // if (!authHeader) {
//     //   const err = new Error ('You are not authenticated!');
//     //   res.setHeader('WWW-Authenticate', 'Basic');
//     //   err.status = 401;
//     //   return next (err);
//     // }
//     // const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');  // buffer is global which means we don't need to import it
//     // const user = auth[0];
//     // const pass = auth[1];
//     // if (user === 'admin' && pass === 'password') {
//     //   //res.cookie('user', 'admin', {signed: true}) 
//     //   req.session.user = 'admin';  //create new session with username as admin
//     //   return next(); // means authorized
//     // } else {
//     //   const err = new Error ('You are not authenticated!');
//     //   res.setHeader('WWW-Authenticate', 'Basic');
//     //   err.status = 401;
//     //   return next (err);
//     // } 
//     // } else {
//     //   //if (req.signedCookies.user === 'admin') { 
//     //   if (req.session.user === 'admin') {
//     //     return next()

//     // we don't need all these above code any more, is because we are doing authentication under user.js now
//     const err = new Error('You are not authenticated!');
//         err.status = 401;
//         return next(err);
//     } else {
       
//         return next ();
//       }
//    }


// app.use(auth);  

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
