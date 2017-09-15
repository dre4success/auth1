// To help authenticate a user when they require a route that needs authentication
const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

/*
	Sign In the User using passport local strategy
*/
// Create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(
	localOptions,
	async (email, password, done) => {
		try {
			// verify this username and password, call done with the user
			// if it is the correct username and password
			// otherwise, call done with false
			const user = await User.findOne({ email }).exec();
			if (!user) {
				return done(null, false, { message: 'Incorrect email or password' });
			}

			// compare passowrds -- is password equal to user.password?
			if (!await user.comparePassword(password)) {
				return done(null, false);
			}

			return done(null, user);
		} catch (err) {
			res.status(400).send(err);
		}
	});

/* 
	This is for when a user wants to make an authenticated request
	maybe to a protected route, we verify the token using the JWT stategy
 */
// Setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
	try {
		// see if the user ID in the payload exists in our database
		// if it does, call 'done' with that user
		// otherwise, call done without a user object
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		return done(null, user);
	} catch (err) {
		res.status(400).send(err);
	}
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
