const mongoose = require("mongoose");

//comment schema
const commentSchema = new mongoose.Schema({
	feed: { type: mongoose.Schema.Types.ObjectId, ref: "feeds" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	comment: String,
	timestamp: { type: Date, default: Date.now() },
});

//comment model
let commentModel = new mongoose.model("comments", commentSchema);

module.exports = commentModel;
