const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectMongoDB = require("./db/connectMongoDB");
const cookieParser = require('cookie-parser');
const path = require('path');
var cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log(process.env.PORT);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// CORS configuration
app.use(cors({
    origin: ["https://cinemates-brown.vercel.app", "https://cinemates-lr5lr27i1-akhil-baratams-projects.vercel.app"],
    credentials: true, // Allow credentials
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['set-cookie']
}));

app.set('trust proxy', 1);
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/posts', require("./routes/postRoutes"));
app.use('/api/collabs', require("./routes/collabRoutes"));
app.use('/api/ads', require("./routes/adRoutes"));
app.use('/api/notifications', require("./routes/notificationRoutes"));

const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectMongoDB();
        app.listen(port, () => {
            console.log(`Server is running on port: ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        // Wait 5 seconds before retrying
        setTimeout(startServer, 5000);
    }
};

startServer();