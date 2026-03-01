import { Document, Schema } from 'mongoose';

export interface ITaskItem extends Document {
    firstName: string;
    phone: string;
    notes: string;
    agentId: Schema.Types.ObjectId;
}
