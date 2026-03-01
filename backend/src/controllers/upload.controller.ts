import { Request, Response, NextFunction } from 'express';
import { parseSpreadsheet } from '../services/upload.service';
import { AppError } from '../middlewares/error.middleware';
import fs from 'fs';

export const uploadAndPreview = async (req: Request, res: Response, next: NextFunction) => {
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
