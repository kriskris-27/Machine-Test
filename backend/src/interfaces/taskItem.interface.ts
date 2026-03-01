import mongoose, { Document } from 'mongoose';

export interface ITaskItem extends Document {
    firstName: string;
    phone: string;
    notes: string;
    agentId: mongoose.Types.ObjectId;
}
