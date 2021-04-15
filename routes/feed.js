const express = require("express");
const verifyToken = require("../auth/verify-token");

const feedModel = require("../models/feed/feed");
const likeModel = require("../models/feed/like");
const commentModel = require("../models/feed/comment");

const { BadRequest } = require("../utils/errors");
const userModel = require("../models/user/user");

const router = express.Router();

const formidable = require("formidable");
const fs = require("fs");
const { cloudinary } = require("../utils/cloudinary.config");

// feed routes

//create feed

router.post("/create", verifyToken, async (req, res, next) => {
	let feed = req.body;

	try {
		if (!feed || !feed.picture) {
			throw new BadRequest("Missing fields");
		}

		let feedObj = new feedModel(feed);
		feedObj.save().then(async (data) => {
			let new_name = data._id;
			const fileStr = feed.picture;
			const uploadResponse = await cloudinary.uploader.upload(fileStr, {
				upload_preset: "feed_pictures",
				public_id: new_name,
				quality: 60,
				width: 300,
				height: 300,
				crop: "fill",
				gravity: "center",
			});
			feed.picture = uploadResponse.secure_url;
			feedModel.updateOne({ _id: data._id }, { $set: feed }).then(() => {
				res.send({ message: "Feed uploaded", code: 1 });
			});
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
});

//like feed
router.post("/like", verifyToken, async (req, res, next) => {
	let like = req.body;

	let { feed, user } = like;

	try {
		if (!feed || !user) {
			throw new BadRequest("Missing fields");
		}

		let alreadyLiked = await likeModel.find(like).countDocuments();

		if (alreadyLiked > 0) {
			likeModel.deleteOne(like).then(() => {
				res.send({
					message: "unliked!",
					code: -1,
				});
			});
		} else {
			let likeObj = likeModel(like);
			likeObj.save().then(() => {
				res.send({ message: "Like added!", code: 1 });
			});
		}
	} catch (err) {
		next(err);
	}
});

//comment on a feed
router.post("/comment", verifyToken, (req, res, next) => {
	let _comment = req.body;

	let { feed, user, comment } = _comment;

	try {
		if (!feed || !user || !comment) {
			throw new BadRequest("Missing fields");
		}

		let commentObj = commentModel(_comment);
		commentObj.save().then(() => {
			res.send({ message: "Comment added!", code: 1 });
		});
	} catch (err) {
		next(err);
	}
});

// get comments
router.get("/comments/:feed_id", verifyToken, async (req, res) => {
	let feed_id = req.params.feed_id;

	let comments = await commentModel.find({ feed: feed_id }).populate("user");

	res.send(comments);
});
// get likes
router.get("/likeusers/:feed_id", verifyToken, async (req, res) => {
	let feed_id = req.params.feed_id;

	let likes = await likeModel.find({ feed: feed_id });

	let user_ids = likes.map((like) => {
		return like.user;
	});

	let users = await userModel.find({ _id: user_ids });

	res.send(users);
});

router.get("/random", verifyToken, async (req, res) => {
	try {
		let feeds = await feedModel.find().populate("user");
		let public_feeds = feeds.filter((feed) => {
			return feed.user.account_type === "public";
		});

		if (public_feeds.length <= 6) {
			res.send({ feeds: public_feeds });
			return;
		}

		let random_feeds = [];
		for (let i = 1; i <= 6; i++) {
			let random_index = Math.floor(Math.random() * public_feeds.length);

			let count = 0;
			random_feeds.map((feed) => {
				if (feed._id.equals(public_feeds[random_index]._id)) {
					count++;
				}
			});

			if (count === 0) {
				random_feeds.push(public_feeds[random_index]);
			} else {
				i--;
			}
		}

		let feed_ids = random_feeds.map((feed) => {
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

		let newfeeds = random_feeds.map((feed) => {
			let likeRecords = likeCount.filter((like) => {
				return like._id.equals(feed._id);
			});

			if (likeRecords.length != 0) {
				feed.likeCount = likeRecords[0].likes.length;
			}

			return feed;
		});

		res.send({ feeds: newfeeds });
	} catch (err) {
		console.log(err);
		next(err);
	}
});

// get a single feed
router.get("/:id", verifyToken, async (req, res, next) => {
	let id = req.params.id;

	let feed = await feedModel.findOne({ _id: id });

	res.send(feed);
});
module.exports = router;

// delete a post
router.get("/delete/:id/", verifyToken, async (req, res, next) => {
	let id = req.params.id;

	try {
		if (!id) throw new BadRequest("Missing ID parameter");

		await feedModel.deleteOne({ _id: id });
		await commentModel.deleteMany({ feed: id });
		await likeModel.deleteMany({ feed: id });

		cloudinary.uploader.destroy(`feed_pictures/${id}`, (err, result) => {
			console.log(err, result);
		});

		res.send({ message: "Feed deleted", code: 1 });
	} catch {
		next(err);
	}
});
