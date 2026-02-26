import { Document } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
