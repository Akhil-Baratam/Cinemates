const generateTokenAndSetCookie = require('../lib/utils/generateToken.js');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

const signup = async (req, res) => {
	try { 
		const { fullName, username, email, password } = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
		}); 

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};


const login = async (req, res) => {
	const startTime = performance.now();
	try {
			const { username, password } = req.body;
			
			// Validate input
			if (!username || !password) {
					return res.status(400).json({ error: "Username and password are required" });
			}

			// Use lean() for better performance and select only needed fields
			const user = await User.findOne({ username })
					.select('password fullName username email followers following profileImg coverImg')
					.lean();

			if (!user) {
					return res.status(400).json({ error: "Invalid username or password" });
			}

			const isPasswordCorrect = await bcrypt.compare(password, user.password);
			if (!isPasswordCorrect) {
					return res.status(400).json({ error: "Invalid username or password" });
			}

			// Remove password from user object
			delete user.password;

			console.log('Generating token for user:', user._id);
			generateTokenAndSetCookie(user._id, res);
			console.log('Token generated and cookie should be set');
			
			// Log response headers
			console.log('Response headers:', res.getHeaders());

			console.log(`Login completed in ${performance.now() - startTime}ms`);
			return res.status(200).json(user);
	} catch (error) {
			console.error("Login error:", error);
			return res.status(500).json({ error: "Internal Server Error" });
	}
};

 
const logout = async (req, res) => {
    try {
        // Clear the JWT cookie
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            expires: new Date(0),
            path: '/'
        });

        res.status(200).json({ 
            message: "Logged out successfully",
            isAuthenticated: false 
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            error: "Internal Server Error",
            isAuthenticated: true 
        });
    }
};

const getMe = async (req, res) => {
    try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
}

const onboarding = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have middleware to protect this route
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Here you can return any necessary data for onboarding
        res.status(200).json({
            onboardingCompleted: user.onboardingCompleted,
            interests: user.interests,
            preferredCollabTypes: user.preferredCollabTypes,
            // Add any other relevant data
        });
    } catch (error) {
        console.error("Error in onboarding controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { signup, login, logout, getMe, onboarding };