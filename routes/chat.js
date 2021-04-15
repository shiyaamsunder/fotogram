const express = require("express");
const verifyToken = require("../auth/verify-token");

const chatModel = require("../models/chat/chat");
const userModel = require("../models/user/user");

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
	// let sender_data = await chatModel.find({ sender: u1, reciever: u2 });
	// let reciever_data = await chatModel.find({ sender: u2, reciever: u1 });

	let chats = await chatModel.find({
		$or: [
			{ sender: u1, reciever: u2 },
			{ sender: u2, reciever: u1 },
		],
	});

	res.send(chats);
});

router.get("/convos/:user_id", verifyToken, async (req, res) => {
	let user = req.params.user_id;

	let recievers = await chatModel.distinct("reciever", { sender: user });
	let senders = await chatModel.distinct("sender", { reciever: user });

	let combinedPersons = recievers.concat(senders);
	let user_ids = [];

	for (let i = 0; i < combinedPersons.length; i++) {
		let p = user_ids.find((person) => {
			return person.toString() === combinedPersons[i].toString();
		});
		if (p == null) {
			user_ids.push(combinedPersons[i]);
		}
	}

	let users = await userModel.find({ _id: user_ids });

	res.send(users);
});
// delete
router.delete("/delete/:id", verifyToken, (req, res) => {
	let { id } = req.params;

	chatModel.deleteOne({ _id: id }).then(() => {
		res.send({ message: "chat deleted" });
	});
});

module.exports = router;
