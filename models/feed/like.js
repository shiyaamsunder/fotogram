const mongoose = require("mongoose");

//like schema
const likeSchema = new mongoose.Schema({
	feed: { type: mongoose.Schema.Types.ObjectId, ref: "feeds" },
	user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	timestamp: { type: Date, default: Date.now() },
});

//like model
let likeModel = new mongoose.model("likes", likeSchema);

module.exports = likeModel;
