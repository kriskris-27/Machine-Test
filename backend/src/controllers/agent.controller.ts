import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Agent from '../models/agent.model';
import TaskItem from '../models/taskItem.model';
import { AppError } from '../middlewares/error.middleware';

export const createAgent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, mobile, password } = req.body;

        const newAgent = await Agent.create({
            name,
            email,
            mobile,
            password
        });

        res.status(201).json({
            status: 'success',
            data: {
                agent: {
                    id: newAgent._id,
                    name: newAgent.name,
                    email: newAgent.email,
                    mobile: newAgent.mobile
                }
            }
        });
    } catch (error: any) {
        if (error.code === 11000) {
            return next(new AppError(400, 'Email or Mobile number already exists'));
        }
        next(error);
    }
};

export const getAllAgents = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agents = await Agent.find().select('-__v');

        res.status(200).json({
            status: 'success',
            results: agents.length,
            data: {
                agents
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAgentTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const agentId = req.params.agentId as string;

        if (!agentId || !mongoose.Types.ObjectId.isValid(agentId)) {
            return next(new AppError(400, 'Invalid Agent ID'));
        }

        const tasks = await TaskItem.find({
            agentId: new mongoose.Types.ObjectId(agentId)
        } as any).select('-__v');

        res.status(200).json({
            status: 'success',
            results: tasks.length,
            data: {
                tasks
            }
        });
    } catch (error) {
        next(error);
    }
};
