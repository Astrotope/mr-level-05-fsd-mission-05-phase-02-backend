import { Router } from 'express';
import { StationController } from '../controllers/stationController.js';

export function createStationRouter(controller: StationController): Router {
    const router = Router();

    // Test endpoint to check database connection
    router.get('/test', async (req, res) => {
        try {
            const count = await controller['stationService'].collection.countDocuments();
            res.json({ message: 'Database connected', count });
        } catch (error) {
            res.status(500).json({ error: error.message });
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
