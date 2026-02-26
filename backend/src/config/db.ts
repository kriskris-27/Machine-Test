import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongodbUri);
        console.log(`📡 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('📡 MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB Connection Error: ${err}`);
});
