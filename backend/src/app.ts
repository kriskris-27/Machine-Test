import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/error.middleware';
import userRoutes from './routes/user.routes';

const app: Application = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Production API' });
});

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK' });
});

// Error Handling
app.use(errorHandler);

export default app;
