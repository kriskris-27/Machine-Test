import { Request, Response, NextFunction } from 'express';

export const getUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({
            id: '1',
            name: 'John Doe',
            email: 'john@example.com'
        });
    } catch (error) {
        next(error);
    }
};
