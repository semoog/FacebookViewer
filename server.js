/* jshint esversion: 6 */

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import FacebookStrategy from 'passport-facebook'; // returns constructor function
import keys from './keys'; // hidden keys in gitignore

const app = express();
const port = 3000;

app.use(session({ secret: keys.sessionSecret }));

// passport facebook init

app.use(passport.initialize());

app.use(passport.session());

passport.use(new FacebookStrategy({
  	clientID: keys.facebookKey, // hidden keys
  	clientSecret: keys.facebookSecret,
  	callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function (token, refreshToken, profile, done) {
    	return done(null, {
      	token: token,
      	profile: profile
    });
}));

// server endpoints

app.get('/auth/facebook', passport.authenticate('facebook'));

// callback for facebook to connect to
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    	successRedirect: '/me', // if success go to /me page
    	failureRedirect: '/auth/facebook' // if fail, go back to re-auth
}));

// get req.user
app.get('/me', (req, res) => {
  	res.send(req.user);
});

// serialize / deserialize for passport
// (only used with session, automatically set as next step from passport.use)

passport.serializeUser(function (user, done) {
  	done(null, user); // put the whole user object from facebook on the session
});

passport.deserializeUser(function (obj, done) {
  	done(null, obj); // get data from session and put it on req.user in every endpoint
});

// listen

app.listen(port, () => {
  	console.log(`Listening on port ${port}`);
});
