import { Request, Response, NextFunction } from 'express';
import Agent from '../models/agent.model';
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
