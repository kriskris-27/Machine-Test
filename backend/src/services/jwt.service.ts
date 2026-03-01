import jwt from 'jsonwebtoken';
import { config } from '../config';

export const signToken = (id: string): string => {
    return jwt.sign({ id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, config.jwtSecret);
};
