const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    category:
      {
        type: String,
      }, 
    subcategory: [
      { 
        type: String,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    bought_on: {
      type: Date,
      default: Date.now,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isNegotiable: {
      type: Boolean,
      default: false,
      required: true,
    },
    isSold: {
      type: Boolean,
      default: false,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    warranty: {
      type: Boolean,
      default: false,
    },
    imgs: [
      {
        type: String,
      },
    ],
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
