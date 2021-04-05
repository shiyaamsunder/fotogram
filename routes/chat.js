const express = require("express");
const verifyToken = require("../auth/verify-token");

const chatModel = require("../models/chat/chat");

const { BadRequest } = require("../utils/errors");

const router = express.Router();

//create chat
router.post("/create", verifyToken, (req, res, next) => {
	let chat = req.body;

	let { sender, reciever, message } = chat;
	try {
		if (!sender || !reciever || !message) {
			throw new BadRequest("Missing required fields");
		}

		let chatObj = new chatModel(chat);
		chatObj.save().then(() => {
			res.send({ message: "Chat created", code: 1 });
		});
	} catch (err) {
		next(err);
	}
});

// get chat convo
router.get("/get_convo/:u1/:u2", verifyToken, async (req, res) => {
	let { u1, u2 } = req.params;
	let sender_data = await chatModel.find({ sender: u1, reciever: u2 });
	let reciever_data = await chatModel.find({ sender: u2, reciever: u1 });

	res.send({ sender_data, reciever_data });
});

// delete
router.delete("/delete/:id", verifyToken, (req, res) => {
	let { id } = req.params;

	chatModel.deleteOne({ _id: id }).then(() => {
		res.send({ message: "chat deleted" });
	});
});

module.exports = router;
