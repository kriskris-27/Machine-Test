import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IAgent } from '../interfaces/agent.interface';

const agentSchema = new Schema<IAgent>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                // Basic regex for mobile with country code (e.g. +911234567890)
                return /^\+\d{1,4}\d{7,14}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid mobile number with country code!`
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    }
}, {
    timestamps: true
});

// Hash password before saving
agentSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
agentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Agent = mongoose.model<IAgent>('Agent', agentSchema);

export default Agent;
