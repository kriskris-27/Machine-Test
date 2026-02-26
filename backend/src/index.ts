import app from './app';
import { config } from './config';
import { connectDB } from './config/db';

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err: any) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

const startServer = async () => {
    try {
        // Connect to Database
        await connectDB();

        app.listen(config.port, () => {
            console.log(`
🚀 Server is running!
🏠 URL: http://localhost:${config.port}
🌍 Environment: ${config.nodeEnv}
            `);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

startServer();
