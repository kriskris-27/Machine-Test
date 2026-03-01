import mongoose from 'mongoose';
import Admin from './models/admin.model';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        await connectDB();

        const adminExists = await Admin.findOne({ email: 'admin@test.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        await Admin.create({
            email: 'admin@test.com',
            password: 'password123'
        });

        console.log('✅ Admin user created successfully');
        console.log('Email: admin@test.com');
        console.log('Password: password123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
