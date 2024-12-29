import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import { StationService } from './services/stationService.js';
import { StationController } from './controllers/stationController.js';
import { createStationRouter } from './routes/stationRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with retry logic
const connectWithRetry = async (retryCount = 0) => {
    const maxRetries = 6; // Will try at 1, 2, 4, 8, 16, and 32 seconds
    const baseDelay = 1000; // 1 second

    try {
        const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017/service_stations', {
            serverApi: ServerApiVersion.v1
        });
        
        await client.connect();
        console.log('Successfully connected to MongoDB.');
        return client;
    } catch (err) {
        console.error(`Failed to connect to MongoDB (attempt ${retryCount + 1}):`, err);

        if (retryCount < maxRetries) {
            const delay = Math.min(baseDelay * Math.pow(2, retryCount), 32000);
            console.log(`Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return connectWithRetry(retryCount + 1);
        } else {
            console.log('Continuing to retry every 32 seconds...');
            await new Promise(resolve => setTimeout(resolve, 32000));
            return connectWithRetry(retryCount);
        }
    }
};

// Start server only after database connection
const startServer = async () => {
    const client = await connectWithRetry();
    const db = client.db('service_stations');

    // Initialize services and controllers
    const stationService = new StationService(db);
    const stationController = new StationController(stationService);
    const stationRouter = createStationRouter(stationController);

    // Basic health check endpoint
    app.get('/health', (req, res) => {
        res.json({ status: 'ok' });
    });

    // Mount routes
    app.use('/api/stations', stationRouter);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

    // Handle database disconnection
    process.on('SIGINT', async () => {
        await client.close();
        process.exit();
    });
};

startServer().catch(console.error);
