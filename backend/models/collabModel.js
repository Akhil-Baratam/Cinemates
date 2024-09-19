const mongoose = require("mongoose");

const collabSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: ["Short Film", "Feature Film", "Documentary", "Music Video", "Commercial", "Youtube Video", "Reels or Shorts", "Other"], // Add more as needed
    },
    genres: [
      {
        type: String,
        enum: ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Documentary", "Other"], // Add more as needed
      },
    ],
    description: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: true,
    },
    pay: {
      type: Number,
      required: function () {
        return this.isPaid;
      },
    },
    timePeriod: {
      type: String,
      enum: ["Less than a week", "Less than a month", "Less than 3 months", "More than 3 months"],
    },
    location: {
      type: String,
      required: true,
    },
    requiredCraftsmen: [
      {
        type: String,
        enum: ["Video Editor", "Audio Mixer", "Cinematographer", "Scriptwriter", "Voice Artist", "Actor", "Director", "Producer", "Other"], // Add more as needed
      },
    ],
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

const Collab = mongoose.model("Collab", collabSchema);

module.exports = Collab;
