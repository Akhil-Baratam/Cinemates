const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectMongoDB = require("./db/connectMongoDB");
const cookieParser = require('cookie-parser')
const path = require('path')
var cloudinary = require('cloudinary').v2;

require('dotenv').config({ path: path.resolve(__dirname, '.env') })
console.log(process.env.PORT)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000", // Development frontend
        "https://cinemates-brown.vercel.app", // Production frontend
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true, 
})
);  

app.use(express.json({ limit: "10mb" }));
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', require("./routes/authRoutes"));
app.use('/api/users', require("./routes/userRoutes"));
app.use('/api/posts', require("./routes/postRoutes"));
app.use('/api/collabs', require("./routes/collabRoutes"));
app.use('/api/ads', require("./routes/adRoutes"));
app.use('/api/notifications', require("./routes/notificationRoutes"));

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    connectMongoDB();
})



