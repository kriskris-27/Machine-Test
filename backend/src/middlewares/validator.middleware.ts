import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';
import { AppError } from './error.middleware';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const message = errors.array().map(err => err.msg).join(', ');
        return next(new AppError(400, message));
    }
    next();
};

export const loginValidator = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

export const agentValidator = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('mobile').matches(/^\+\d{1,4}\d{7,14}$/).withMessage('Valid mobile number with country code is required (e.g. +911234567890)'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];
