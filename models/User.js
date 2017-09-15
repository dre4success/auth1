const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const Promise = require('bluebird');

const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
});

// On Save Hook, encrypt password
// Before saving this model, run this function

userSchema.pre('save', function(next) {
	// get access to the user model
	const user = this;

	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}

		// hash (encrypt) password using the salt
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if (err) {
				return next(err);
			}

			user.password = hash;
			next();
		});
	});
});

/*userSchema.methods.comparePassword = function(canditatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) { return callback(err); }

		callback(null, isMatch)
	})
}*/

userSchema.methods.comparePassword = function (candidatePassword) {

	return bcrypt.compareAsync(candidatePassword, this.password);		

}

const modelClass = mongoose.model('user', userSchema);

module.exports = modelClass;
