const mongoose = require("mongoose");

const rohSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      enum: [
        "Cameras and Accessories",
        "Lighting Equipment",
        "Audio Gear",
        "Storage and Memory",
        "Studio Setup",
        "Drones and Aerial Equipment",
        "Mobile Filmmaking",
      ],
    },
    department: {
      type: String,
      required: true,
      enum: ["Filmmaking", "Photography", "Audio Production", "Post-Production", "Other"],
    },
    isForHelp: {
      type: Boolean,
      default: false,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: function () {
        return !this.isForHelp;
      },
    },
    isNegotiable: {
      type: Boolean,
      default: false,
      required: true,
    },
    imgs: [
      {
        type: String,
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        text: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          min: 0,
          max: 5,
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

const Roh = mongoose.model("Roh", rohSchema);

module.exports = Roh;
