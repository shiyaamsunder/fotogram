const jwt = require("jsonwebtoken");
const tokens = require("../auth/tokens");

module.exports = function verifyToken(req, res, next) {
	//verify token and store user data in req
	let tokenData = req.headers["authorization"];

	if (tokenData != undefined) {
		let token = tokenData.split(" ")[1];

		jwt.verify(token, tokens.token_key, async (err, user) => {
			if (err != null) {
				res.status(401);
				res.send({ message: "Unauthorized", code: 401 });
			} else {
				res.user = user;
				next();
			}
		});
	} else {
		res.status(403);
		res.send({ message: "Forbidden", code: 403 });
	}
};
