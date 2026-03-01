import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/jwt.service';
import Admin from '../models/admin.model';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(new AppError(401, 'You are not logged in! Please log in to get access.'));
        }

        const decoded = verifyToken(token);

        const currentAdmin = await Admin.findById(decoded.id);
        if (!currentAdmin) {
            return next(new AppError(401, 'The user belonging to this token no longer exists.'));
        }

        req.user = currentAdmin;
        next();
    } catch (error) {
        next(new AppError(401, 'Invalid token. Please log in again.'));
    }
};
