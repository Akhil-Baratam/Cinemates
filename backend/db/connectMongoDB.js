const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        // Remove deprecated options, keep only the necessary ones
        const options = {
            serverSelectionTimeoutMS: 5000, // How long to try connecting before timeout
            socketTimeoutMS: 45000,         // How long to wait for operations
            family: 4                       // Use IPv4, skip IPv6
        };

        const conn = await mongoose.connect(process.env.MONGO_URI, options);
        
        // Add connection event listeners for better monitoring
        mongoose.connection.on('error', err => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected. Attempting to reconnect...');
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectMongoDB;