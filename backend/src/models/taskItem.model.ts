import mongoose, { Schema } from 'mongoose';
import { ITaskItem } from '../interfaces/taskItem.interface';

const taskItemSchema = new Schema<ITaskItem>({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    agentId: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: [true, 'Agent assignment is required']
    }
}, {
    timestamps: true
});

const TaskItem = mongoose.model<ITaskItem>('TaskItem', taskItemSchema);

export default TaskItem;
