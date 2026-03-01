import { Request, Response, NextFunction } from 'express';
import Admin from '../models/admin.model';
import { signToken } from '../services/jwt.service';
import { AppError } from '../middlewares/error.middleware';

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return next(new AppError(400, 'Please provide email and password!'));
        }

        // 2) Check if user exists && password is correct
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin || !(await admin.comparePassword(password))) {
            return next(new AppError(401, 'Incorrect email or password'));
        }

        // 3) If everything ok, send token to client
        const token = signToken(admin._id.toString());

        res.status(200).json({
            status: 'success',
            token,
            data: {
                admin: {
                    id: admin._id,
                    email: admin.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};
