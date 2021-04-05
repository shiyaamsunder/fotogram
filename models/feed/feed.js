const mongoose = require("mongoose");

//feed schema
const feedSchema = new mongoose.Schema({
	picture: { type: String },
	caption: String,
	hashtags: [String],
	location: String,
	tags: [String],
	user: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
	timestamp: { type: Date, default: Date.now() },
	likeCount: {type: Number, default: 0},
	already_liked: {type: Boolean, default: false}
});

//feed model
let feedModel = new mongoose.model("feeds", feedSchema);

module.exports = feedModel;
