const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({sub: user._id, iat: timestamp}, config.secret);
}

exports.signin = (req, res, next) => {
	// User has already had their email and password auth'd
	// we just need to give them a token
	res.send({token: tokenForUser(req.user) });
}

exports.signup = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		if(!email || !password) {
			return res.status(422).send({error: 'You must provide email and password'})
		}

		// See if a user with the given email exists
		const existingUser = await User.findOne({ email });

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email already exists' });
		}

		// If a user with email does Not exist, create and save user record
		const user = await new User({ email, password }).save();

		// Respond to request indicating the user was created
		res.json({ token: tokenForUser(user) });

	} catch (err) {
		res.status(400).send(err);
	}
};
