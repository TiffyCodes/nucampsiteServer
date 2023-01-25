var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//SETUP- add our routers from node-express to router folder and import them here
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

//connect to server
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
connect.then(() => console.log('Connected correctly to server'),
//if doesn't connect, we will handle this.  Instead of catch here, we will try it a diff way by passing another argument to the then method
  err => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//COOOKIES we need to add a "secret key" string as an argument to the cookie parser supplied by express generator- just came up with a random one 1234..
//COOKIES it will be used to encrypt the info and sign the cookie sent from the server to the client
app.use(cookieParser('12345-67890-09876-54321'));
//*** *************************************************************************/
//Week III- adding the ***authentication middleware*** here bc we don't need it before here to require a user to enter credentials.  The order matters.
// function auth(req, res, next) {
//   console.log(req.headers);
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     const err = new Error('You are not authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     //then send the error message to client via express below- and then challenge the client for their credentials and then go back thru the process
//     return next(err);
//   }
//   //Buffer is a global class from nodeJS (fyi- from is a static method of buffer) so we don't have to require it.  The code below will take the auth header and extract the UN and PW
//   const auth = Buffer.from(authHeader.split('')[1], 'base64').toString().split(':');
//   const user = auth[0];
//   const pass = auth[1];
//   if (user === 'admin' && pass === 'password') {
//     return next();  //authorized
//   } else {
//     const err = new Error('You are not authenticated!');
//     res.setHeader('WWW-Authenticate', 'Basic');
//     err.status = 401;
//     return next(err);
//   }
// }

function auth(req, res, next) {
  // console.log(req.headers);
  if (!req.signedCookies.user) {
    //signedCookies prop of the req obj is provided by cookie parser and it will parse a signed cookie from the req, if the cookie is not properly signer, it will return as false
    //if it is false, then it hasn't been authenticated, so we will challend the user to authenticate
    
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];
    if (user === 'admin' && pass === 'password') {
      //since correct, we will set up a cookie here- we will create a cookie, will set up a name for the cookie- user, and the value to store in the name property of user obj that we will name admin, the third argument is optional and is an object that contains config values setting the property as signed to true
      res.cookie('user', 'admin', {signed: true});
        return next(); // authorized
    } else {
        const err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');      
        err.status = 401;
        return next(err);
    }
  } else {
    //Will check if a signed value in the cookie req
    if (req.signedCookies.user === 'admin') {
      //if so will send to next middleware fx
      return next();
    } else {
      //will sent an error response
        const err = new Error('You are not authenticated!');
        err.status = 401;
        return next(err);
    }
  }
}
app.use(auth);
//*****Now test in incognito mode in browser (so doesn't keep info in cookies) and postman, for /campsites or any other pg will req auth*/
//*** *************************************************************************/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//SETUP- add the routers from node-express to app.use as well
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
