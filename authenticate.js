const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
//Auth Tokens- we will keep local strategy and then put more imports below
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const config = require('./config.js');

//below requires a verify pw fx- will use the authenticate method (a method on the user model user.auth..)
exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Auth Tokens
exports.getToken = user => {
    return jwt.sign(user, config.secretKey,  {expiresIn: 3600});
    //3600 allows us to test it, in real like you would do it in a few days for example, you should not set it to never expire (meaning you didn't include a time)
};
const opts = {};
//options we will set as an empty obj
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//above specifies where we will get the token- we are saying to send it to us as an auth header as a bearer token (see docs for other options but this is standard )
opts.secretOrKey = config.secretKey;
exports.jwtPassport = passport.use(
    new JwtStrategy(
        //first argument  is options object we created
        opts,
        //next is the verify fx argument
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    //done is written in the jwt module, we don't need to write it
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else{
                    returndone(null, false);
                    //so no error and no user
                    //should make this to prompt to create a new user account**
                }
            });
        }

    )
)
exports.verifyUser = passport.authenticate('jwt', {session: false});
//session false makes it so we aren't using sessions we will create this const so we don't have to keep re-writing the jwt and session: false