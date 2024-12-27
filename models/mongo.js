import * as config from '../config.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const { db_config } = config;

const mg = {
    connectToServer: async function (callback) {
        try {
            // Connect to MongoDB using the connection string from db_config
            await mongoose.connect(db_config.connection_string, { 
                useNewUrlParser: true, 
                useUnifiedTopology: true // Added to prevent deprecation warnings
            });

            console.log('Connected to MongoDB successfully!');
            if (callback) callback(); // Call the callback function if provided
        } catch (e) {
            console.error('Failed to connect to MongoDB:', e);
            console.log('Not connected');
        }
    }
}

export default mg;
