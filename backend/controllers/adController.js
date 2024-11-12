const Notification = require("../models/notificationModel");
const Ad = require("../models/adModel");
const User = require("../models/userModel");
var cloudinary = require("cloudinary").v2;

const createAd = async (req, res) => {
  try {
    const { description, imgs, price, address, bought_on } = req.body;
    const userId = req.user._id.toString();

    // Validate that all required fields are provided
    if (!description) { 
      return res.status(400).json({ error: "Description is required" });
    }

    // if (!imgs || imgs.length === 0) {
    //     return res.status(400).json({ error: "At least one image is required" });
    // }

    if (!price) {
      return res.status(400).json({ error: "Price is required" });
    }

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    if (!bought_on) {
      return res.status(400).json({ error: "Bought on date is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgUrls = [];
    console.log("Uploading images to Cloudinary...");
    if (imgs) {
      for (const img of imgs) {
        try {
          const uploadedResponse = await cloudinary.uploader.upload(img, {
            folder: "ads",
          });
          console.log("Cloudinary upload successful:", uploadedResponse);
          imgUrls.push(uploadedResponse.secure_url);
        } catch (uploadError) {
          console.error("Error uploading to Cloudinary:", uploadError);
          return res.status(500).json({ error: "Error uploading images" });
        }
      }
    }

    const newAd = new Ad({
      user: userId,
      description,
      imgs: imgUrls,
      price,
      address,
      bought_on,
    });

    await newAd.save();
    res.status(201).json(newAd);
  } catch (error) {
    console.error("Error in createAd controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
 
const deleteAd = async (req, res) => {
	try {
		const ad = await Ad.findById(req.params.id);
		if (!ad) {
			return res.status(404).json({ error: "Ad not found" });
		}

		// Check if the logged-in user is the owner of the ad
		if (ad.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this ad" });
		}

		// Loop through the imgs array and delete each image from Cloudinary
		if (ad.imgs && ad.imgs.length > 0) {
			console.log("Deleting images from Cloudinary...");
			for (const img of ad.imgs) {
				try {
					const imgId = img.split("/").pop().split(".")[0];
					await cloudinary.uploader.destroy(imgId);
					console.log(`Deleted image ${imgId} from Cloudinary`);
				} catch (cloudinaryError) {
					console.error("Error deleting image from Cloudinary:", cloudinaryError);
					return res.status(500).json({ error: "Error deleting images from Cloudinary" });
				}
			}
		}

		// Delete the ad from the database
		await Ad.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Ad deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAd controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const commentOnAd = async (req, res) => {
	try {
		const { text } = req.body;
		const adId = req.params.id;
		const userId = req.user._id;

		// Validate input
		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		// Find the ad by ID
		const ad = await Ad.findById(adId);
		if (!ad) {
			return res.status(404).json({ error: "Ad not found" });
		}

		// Add the comment to the ad
		const comment = { user: userId, text };
		ad.comments.push(comment);
		await ad.save();

		res.status(200).json(ad);
	} catch (error) {
		console.log("Error in commentOnAd controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const interestedAd = async (req, res) => {
	try {
		const userId = req.user._id;
		const { id: adId } = req.params;

		// Find the ad by ID
		const ad = await Ad.findById(adId);
		if (!ad) {
			return res.status(404).json({ error: "Ad not found" });
		}

		// Check if the user has already liked the ad
		const userInterestedAd = ad.interests.includes(userId);

		if (userInterestedAd) {
			// Unlike the ad
			await Ad.updateOne({ _id: adId }, { $pull: { interests: userId } });
			await User.updateOne({ _id: userId }, { $pull: { interestedAds: adId } });

            const updatedInterests = ad.interests.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedInterests);
		} else {
			// Like the ad
			ad.interests.push(userId);
            await User.updateOne({ _id: userId }, { $push: { interestedAds: adId } });
			await ad.save();

			// Create a notification (assuming a Notification model exists)
			// const notification = new Notification({
			// 	from: userId,
			// 	to: ad.user, 
			// 	type: "interest",
			// });
			// await notification.save();

			res.status(200).json(ad.interests);
		}
	} catch (error) {
		console.log("Error in interestedAd controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

const getAllAds = async (req, res) => {
	try {
		const ads = await Ad.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(ads);
	} catch (error) {
		console.log("Error in getAllAds controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const getInterestedAds = async (req, res) => {
	const userId = req.params.id;

	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const interestedAds = await Ad.find({ _id: { $in: user.interestedAds } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(interestedAds);
	} catch (error) {
		console.log("Error in getInterestedAds controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const getUserAds = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const ads = await Ad.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(ads);
	} catch (error) {
		console.log("Error in getUserAds controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


module.exports = { createAd, deleteAd, commentOnAd, interestedAd, getAllAds, getInterestedAds, getUserAds };
 