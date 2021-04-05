const express = require("express");
const connectionModel = require("../models/user/connection");

const verifyToken = require("../auth/verify-token");
const { BadRequest } = require("../utils/errors");
const userModel = require("../models/user/user");

const router = express.Router();

//connection route
router.post("/create", verifyToken, async (req, res, next) => {
	let connection = req.body;
	let message = "";

	let { influencer, follower } = connection;
	let _influencer = await userModel.findOne({ _id: influencer });

	try {
		if (!influencer || !follower) {
			throw new BadRequest("Missing Fields");
		}

		if (_influencer.account_type === "private") {
			connection.status = 0; //request pending
			message = "Request Sent";
		} else {
			connection.status = 1; //followed
			message = "Follow successful";
		}

		let connectionObj = new connectionModel(connection);
		connectionObj.save().then(() => {
			res.send({ message, code: 1 });
		});
	} catch (err) {
		next(err);
	}
});

// route to accept and delete follow request
router.post("/action", verifyToken, async (req, res, next) => {
	let connection_action = req.body;
	let message = "";
	let { connection, action } = connection_action;

	try {
		if (!connection || !action) {
			throw new BadRequest("Missing fields");
		}

		if (action === "accept") {
			await connectionModel.updateOne(
				{ _id: connection },
				{ $set: { status: 1 } }
			); //accepted
			message = "Request Accepted";
		} else if (action === "delete") {
			await connectionModel.deleteOne({ _id: connection });
			message = "Request Deleted";
		}
		res.send({ message, code: 1 });
	} catch (err) {
		next(err);
	}
});

// route to unfollow
router.post("/unfollow", verifyToken, async (req, res, next) => {
	let body = req.body;
	let message = "";
	let { id } = body;

	try {
		if (!id) throw new BadRequest("Missing id field");

		await connectionModel.deleteOne({ _id: id });
		message = "Deleted";
		res.send({ message, code: 1 });
	} catch (err) {
		next(err);
	}
});

module.exports = router;
