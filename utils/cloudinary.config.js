const cloudinary = require("cloudinary").v2;

const {
	CLOUDINARY_HOST,
	CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
	cloud_name: CLOUDINARY_HOST,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET,
});

module.exports = { cloudinary };
