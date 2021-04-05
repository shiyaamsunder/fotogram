const mongoose = require("mongoose");

//user schema
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: [true, "Enter an email."],
		unique: [true, "Email is already registered."],
	},
	password: { type: String, required: true },
	username: {
		type: String,
		required: [true, "Enter an username"],
		unique: [true, "That username is already taken."],
	},
	profile_picture: { type: String, default: "" },
	account_type: { type: String, default: "public" },
	bio: { type: String, default: "" },
});

userSchema.methods.toJSON = function () {
	let obj = this.toObject();
	delete obj.password;
	return obj;
};
//user model
let userModel = new mongoose.model("users", userSchema);

module.exports = userModel;
