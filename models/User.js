const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String
})

const modelClass = mongoose.model('user', userSchema)

module.exports = modelClass;