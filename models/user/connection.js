const mongoose = require("mongoose");

//connection schema
const connectionSchema = new mongoose.Schema({
	influencer: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	follower: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	status: Number,
	timestamp: { type: Date, default: Date.now() },
});

//connection model
let connectionModel = new mongoose.model("connections", connectionSchema);

module.exports = connectionModel;
