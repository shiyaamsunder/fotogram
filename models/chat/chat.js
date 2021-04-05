const mongoose = require("mongoose");

//chat schema
const chatSchema = new mongoose.Schema({
	sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	reciever: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
	message: String,
	timestamp: { type: Date, default: Date.now() },
});

//chat model
let chatModel = new mongoose.model("chats", chatSchema);

module.exports = chatModel;
