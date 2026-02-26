import { Document } from 'mongoose';

export interface IAgent extends Document {
    name: string;
    email: string;
    mobile: string; // Including country code, e.g., +919876543210
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
