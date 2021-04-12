const express = require("express");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user/user");
const feedModel = require("../models/feed/feed");
const connectionModel = require("../models/user/connection");
const likeModel = require("../models/feed/like");
const tokens = require("../auth/tokens");
const verifyToken = require("../auth/verify-token");
const {
	BadRequest,
	GeneralError,
	LoginError,
	RegisterError,
} = require("../utils/errors");

const router = express.Router();
const formidable = require("formidable");
const fs = require("fs");

const { cloudinary } = require("../utils/cloudinary.config");

// user routes
// register
router.post("/register", async (req, res, next) => {
	let user = req.body;

	const { name, username, password, email } = user;

	try {
		if (!name || !username || !password || !email) {
			throw new BadRequest("Missing required fields");
		}

		let _email = await userModel.findOne({ email: email });
		if (_email) {
			throw new RegisterError("This email is already registered");
		}

		let _user = await userModel.findOne({ username: username });
		if (_user) {
			throw new RegisterError("Username is already taken");
		}

		user.password = crypto
			.pbkdf2Sync(user.password, tokens.salt, 1000, 64, "sha512")
			.toString("hex");
		let userObj = new userModel(user);
		userObj.save().then(() => {
			res.send({ message: "User Created!", code: 1 });
		});
	} catch (err) {
		next(err);
	}
});

//login
router.post("/login", async (req, res, next) => {
	let userCredentials = req.body;

	const { username, password } = userCredentials;

	try {
		if (!username || !password) {
			throw new BadRequest("Missing fields username and/or password");
		}

		userCredentials.password = crypto
			.pbkdf2Sync(userCredentials.password, tokens.salt, 1000, 64, "sha512")
			.toString("hex");

		let userCount = await userModel.findOne(userCredentials).countDocuments();
		if (userCount == 1) {
			let user = await userModel.findOne(userCredentials);
			jwt.sign(userCredentials, tokens.token_key, (error, token) => {
				if (error !== null) {
					throw new GeneralError("Some internal error");
				} else {
					res.send({ token, user, code: 1 });
				}
			});
		} else {
			throw new LoginError("Wrong username or password");
		}
	} catch (err) {
		next(err);
	}
});

// fetch all users
router.get("/all", verifyToken, async (req, res, next) => {
	try {
		let users = await userModel.find();
		res.send(users);
	} catch (err) {
		next(err);
	}
});

//user fetch
router.get("/me/:id", verifyToken, async (req, res, next) => {
	let id = req.params.id;

	try {
		if (!id) throw new BadRequest("Missing id parameter");
		let user = await userModel.findOne({ _id: id });
		res.send(user);
	} catch (err) {
		console.log(err);
		next(err);
	}
});

//fetch profile details
router.get("/profile/:username", verifyToken, async (req, res, next) => {
	let username = req.params.username;

	try {
		let user = await userModel.findOne({ username: username });
		let id = user.id;

		let feeds = await feedModel
			.find({ user: user._id })
			.populate("user")
			.sort({ timestamp: -1 });
		let feed_ids = feeds.map((feed) => {
			return feed._id;
		});
		let likeCount = await likeModel.aggregate([
			{
				$match: { feed: { $in: feed_ids } },
			},
			{
				$group: {
					_id: "$feed",
					likes: { $push: "$$ROOT" },
				},
			},
		]);

		let newfeeds = feeds.map((feed) => {
			let likeRecords = likeCount.filter((like) => {
				return like._id.equals(feed._id);
			});

			if (likeRecords.length != 0) {
				let checkForLike = likeRecords[0].likes.filter((like) => {
					return like.user.equals(id);
				});

				if (checkForLike.length > 0) {
					feed.already_liked = true;
				} else {
					feed.already_liked = false;
				}

				feed.likeCount = likeRecords[0].likes.length;
			}

			return feed;
		});

		let influencers = await connectionModel
			.find({ follower: user._id })
			.populate("influencer");
		let followers = await connectionModel
			.find({ influencer: user._id })
			.populate("follower");

		res.send({ user: user, influencers, followers, feeds: newfeeds });
	} catch (err) {
		console.log(err);
		next(err);
	}
});

router.get("/home/:id", verifyToken, async (req, res, next) => {
	let id = req.params.id;
	try {
		let influencers = await connectionModel.find({ follower: id });
		let influencer_ids = influencers.map((ele) => {
			return ele.influencer;
		});

		influencer_ids.push(id);

		let feeds = await feedModel
			.find({ user: influencer_ids })
			.populate("user")
			.sort({ timestamp: -1 });

		let feed_ids = feeds.map((feed) => {
			return feed._id;
		});

		let likeCount = await likeModel.aggregate([
			{
				$match: { feed: { $in: feed_ids } },
			},
			{
				$group: {
					_id: "$feed",
					likes: { $push: "$$ROOT" },
				},
			},
		]);

		let newfeeds = feeds.map((feed) => {
			let likeRecords = likeCount.filter((like) => {
				return like._id.equals(feed._id);
			});

			if (likeRecords.length != 0) {
				let checkForLike = likeRecords[0].likes.filter((like) => {
					return like.user.equals(id);
				});

				if (checkForLike.length > 0) {
					feed.already_liked = true;
				} else {
					feed.already_liked = false;
				}

				feed.likeCount = likeRecords[0].likes.length;
			}

			return feed;
		});

		res.send(newfeeds);
	} catch (err) {
		next(err);
		console.log(err);
	}
});

//update
router.put("/update/:id", verifyToken, async (req, res, next) => {
	let profile = req.body;
	let id = req.params.id;

	try {
		if (!profile) throw new BadRequest("EMpty object");

		if (profile.profile_picture === undefined) {
			userModel.updateOne({ _id: id }, { $set: profile }).then(() => {
				res.send({ message: "Details updated", code: 1 });
			});
		} else {
			const fileStr = profile.profile_picture;
			const uploadResponse = await cloudinary.uploader.upload(fileStr, {
				upload_preset: "profile_pictures",
				public_id: id,
				quality: 50,
				width: 500,
				height: 500,
				crop: "fill",
				radius: "max",
				gravity: "center",
			});
			profile.profile_picture = uploadResponse.secure_url;

			userModel
				.findOneAndUpdate(
					{ _id: id },
					{ $set: profile },
					{ returnOriginal: false }
				)
				.then((err, documents) => {
					res.send({
						message: "Details updated",
						code: 1,
						user: documents,
					});
				});
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
});

module.exports = router;
