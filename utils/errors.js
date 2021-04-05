class GeneralError extends Error {
	constructor(message) {
		super();
		this.message = message;
	}

	getCode() {
		if (this instanceof BadRequest) {
			return 400;
		}
		if (this instanceof NotFound) {
			return 404;
		}
		if (this instanceof LoginError) {
			return 401;
		}
		if (this instanceof RegisterError) {
			return 200;
		}

		return 500;
	}
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class LoginError extends GeneralError {}
class RegisterError extends GeneralError {}

module.exports = {
	GeneralError,
	BadRequest,
	NotFound,
	LoginError,
	RegisterError,
};
