import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const config = {
    port: process.env.PORT || 5001,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/machine-test',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
};
