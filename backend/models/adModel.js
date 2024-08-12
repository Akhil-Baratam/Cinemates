const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
        price: {
            type: Number,
            required: true,
        },
        bought_on: {
            type: Date,
            default: Date.now,
        },
		img: {
			type: String,
		},
		interests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("ad", adSchema);

module.exports = Post;