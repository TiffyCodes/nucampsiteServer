const express = require('express');
const User = require('../models/user');
const router = express.Router();
//** Week III add passport auth */
const passport = require('passport');
//Change to Tokens week III
const authenticate = require('../authenticate');
//cors- routes week IV add below
const cors = require('./cors');



/* GET users listing. */
//**my stab at it first */
// router.get('/', function(req, res, next) {
//   // res.send('respond with a resource');
//   if (authenticate.verifyAdmin) {
//     res.send('respond with a resource');
//   } else {

//   }
// });

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find()
  .then(users => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
  .catch(err => next(err));
});

//added week IV for FB
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
      const token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
});

//for the below- after path argument, need to pass a middleware argument
// router.post('/signup', (req, res, next) => {
//   User.findOne({username: req.body.username})
//   .then(user => {
//     //should either have a user doc or a null value meaning no doc with that username-- so checkign below
//     if (user) {
//       const err = new Error(`User ${req.body.username} already exists!`);
//       err.status = 403;
//       return next(err);
//     } else {
//       User.create({
//         username: req.body.username,
//         password: req.body.password
//       })
//       .then(user => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json({status: 'Registration Successful', user: user});
//       })
//       .catch(err => next(err));
//     }
//   })
//   //below doesn't mean no user was foound, but some other error
//   .catch(err => next(err));
//**Updating to use passort */
router.post('/signup', cors.corsWithOptions, (req, res ) => {
  User.register(
    new User({username: req.body.username}),
    req.body.password,
    // err => {
    (err, user) => {
      if (err) {
        //if something went wrong while trying to register like db config
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      } else {
        //the authenticate method will return a fx and we will need to call it by setting up a second fx
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save(err => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            return;
          }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
      }
    }
  );
});

//handle a post req to /users/login- changed to username and pw
// router.post('/login', (req, res, next) => {
//   if(!req.session.user) {

//     //***pasted from app.js
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         const err = new Error('You are not authenticated!');
//         res.setHeader('WWW-Authenticate', 'Basic');
//         err.status = 401;
//         return next(err);
//     }

//     const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
//     const username = auth[0];
//     const password = auth[1];
//     //*** */
//     User.findOne({username: username})
//     .then(user => {
//       if (!user) {
//         const err = new Error(`User ${username} does not exist!`);
//         err.status = 401;
//         return next(err);
//       } else if (user.password !== password) {
//         const err = new Error('Your password is incorrect!');
//         err.status = 401;
//         return next(err);
//       } else if (user.username === username && user.password === password) {
//         req.session.user = 'authenticated';
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'text/plain');
//         res.end('You are authenticated');
//       }
//     })
//     .catch(err => next(err));

//   } else {
//     //means there is a session for this client- they are logged in
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     res.end('You are already authenticated!');
//   }
//** Week II replace with passport */
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  //adding to issue a token below
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  // res.json({success: true, status: 'Youare successfully loggeed in!'});
  res.json({success: true, token: token, status: 'Youare successfully loggeed in!'});
});

//logging out the user, since not sending info, we will use a get
router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err);
  }
});

module.exports = router;
