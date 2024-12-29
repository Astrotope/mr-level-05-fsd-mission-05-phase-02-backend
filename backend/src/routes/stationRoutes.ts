import { Router } from 'express';
import { StationController } from '../controllers/stationController.js';

export function createStationRouter(controller: StationController): Router {
    const router = Router();

    // Test endpoint to check database connection
    router.get('/test', async (req, res) => {
        try {
            // Use a public method instead of accessing private property
            const count = await controller.getStationCount();
            res.json({ message: 'Database connected', count });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            res.status(500).json({ error: errorMessage });
        }
    });

    // Search stations by location and other criteria
    router.get('/search', controller.searchStations);

    // Get cheapest stations for a specific fuel type
    router.get('/cheapest/:fuelType', controller.getCheapestStations);

    // Get available features
    router.get('/features', controller.getFeatures);

    // Get station types
    router.get('/types', controller.getStationTypes);

    // Get fuel types
    router.get('/fuel-types', controller.getFuelTypes);

    return router;
}