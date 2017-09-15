const User = require('../models/user');

exports.signup = async (req, res, next) => {
	try {
		const email = req.body.email;
		const password = req.body.password;

		// See if a user with the given email exists
		const existingUser = await User.findOne({ email });

		// If a user with email does exist, return an error
		if (existingUser) {
			return res.status(422).send({ error: 'Email already exists' });
		}

		// If a user with email does Not exist, create and save user record
		const user = await new User({ email, password }).save();

		// Respond to request indicating the user was created
		res.json({ success: true });
		
	} catch (err) {
		res.status(400).send(err);
	}
};
