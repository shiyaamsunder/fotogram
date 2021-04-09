const express = require("express");
const app = express();
const cors = require("cors");
const handleErrors = require("./middleware/handleError");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: "./config.env" });

//mongodb connection
mongoose.connect(
	process.env.MONGO_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
	() => {
		console.log("connected to db");
	}
);

// middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: "true" }));

//custom router module inclusion
const userRouter = require("./routes/user");
const feedRouter = require("./routes/feed");
const chatRouter = require("./routes/chat");
const connectionRouter = require("./routes/connection");

// route middlewares
app.use("/user", userRouter);
app.use("/feed", feedRouter);
app.use("/chat", chatRouter);
app.use("/connection", connectionRouter);

//error handler middleware
app.use(handleErrors);

// static files
app.use(
	"/feed_pictures",
	express.static(path.join(__dirname, "feed_pictures"))
);
app.use(
	"/profile_pictures",
	express.static(path.join(__dirname, "profile_pictures"))
);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/client/build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT;
// start the server
app.listen(PORT, () => {
	console.log(`server started in ${PORT} ...`);
});
