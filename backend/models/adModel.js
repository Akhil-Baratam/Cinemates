const mongoose = require('mongoose');

const adSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
        price: {
            type: Number,
            required: true,
        },
        bought_on: {
            type: Date,
            default: Date.now,
            required: true,
        },
		imgs: [
			{
				type: String,
			}
		],
        address: {
            type: String,
            required: true,
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

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
