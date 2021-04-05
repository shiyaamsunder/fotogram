const { GeneralError } = require("../utils/errors");

const handleErrors = (err, req, res, next) => {
	if (err instanceof GeneralError) {
		return res.status(err.getCode()).json({
			status: "error",
			message: err.message,
			code: err.getCode(),
		});
	}

	return res.status(500).json({
		status: "error",
		message: "Some internal server error.",
	});
};

module.exports = handleErrors;
