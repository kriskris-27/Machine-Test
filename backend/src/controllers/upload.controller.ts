import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';
import Agent from '../models/agent.model';
import TaskItem from '../models/taskItem.model';
import { parseSpreadsheet, distributeTasks } from '../services/upload.service';

export const uploadAndDistribute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            return next(new AppError(400, 'Please upload a file'));
        }

        // 1. Parse File
        const rawTasks = parseSpreadsheet(req.file.path);

        // 2. Get Agents (Limiting to 5 for now as per requirement, or all active)
        const agents = await Agent.find().limit(5);
        if (agents.length === 0) {
            return next(new AppError(400, 'No agents found to distribute tasks to.'));
        }

        // 3. Distribute
        const distributedTasks = distributeTasks(rawTasks, agents);

        // 4. Bulk Save
        await TaskItem.insertMany(distributedTasks);

        // 5. Cleanup
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            status: 'success',
            message: `Successfully distributed ${rawTasks.length} tasks among ${agents.length} agents.`,
            data: {
                totalDistributed: distributedTasks.length
            }
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        next(error);
    }
};

export const uploadAndPreview = async (req: Request, res: Response, next: NextFunction) => {
    // ...
    try {
        if (!req.file) {
            return next(new AppError(400, 'Please upload a file'));
        }

        const data = parseSpreadsheet(req.file.path);

        // Clean up file immediately after parsing for Task 15 completion
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            status: 'success',
            results: data.length,
            data: {
                tasks: data
            }
        });
    } catch (error) {
        // Clean up file if error occurs
        if (req.file) fs.unlinkSync(req.file.path);
        next(error);
    }
};
