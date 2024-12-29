import { Request, Response } from 'express';
import { StationService } from '../services/stationService.js';

export class StationController {
    constructor(private stationService: StationService) {}

    searchStations = async (req: Request, res: Response): Promise<void> => {
        try {
            const { 
                latitude, 
                longitude, 
                maxDistance,
                fuelType,
                features,
                stationType,
                sortBy,
                limit  // Add limit parameter
            } = req.query;

            if (!latitude || !longitude) {
                res.status(400).json({ error: 'Latitude and longitude are required' });
                return;
            }

            const params = {
                latitude: parseFloat(latitude as string),
                longitude: parseFloat(longitude as string),
                maxDistance: maxDistance ? parseFloat(maxDistance as string) : undefined,
                fuelType: fuelType as string | undefined,
                features: features ? (features as string).split(',') : undefined,
                stationType: stationType as string | undefined,
                sortBy: sortBy as 'distance' | 'price' | undefined,
                limit: limit ? parseInt(limit as string) : undefined  // Parse limit parameter
            };

            const stations = await this.stationService.findNearestStations(params);
            res.json(stations);
        } catch (error) {
            console.error('Error searching stations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getCheapestStations = async (req: Request, res: Response): Promise<void> => {
        try {
            const { fuelType } = req.params;
            const { limit } = req.query;  // Add limit from query params

            if (!fuelType) {
                res.status(400).json({ error: 'Fuel type is required' });
                return;
            }

            const stations = await this.stationService.findCheapestStations(
                fuelType,
                limit ? parseInt(limit as string) : undefined
            );
            res.json(stations);
        } catch (error) {
            console.error('Error getting cheapest stations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getFeatures = async (_req: Request, res: Response): Promise<void> => {
        try {
            const features = await this.stationService.getStationFeatures();
            res.json(features);
        } catch (error) {
            console.error('Error getting features:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getStationTypes = async (_req: Request, res: Response): Promise<void> => {
        try {
            const types = await this.stationService.getStationTypes();
            res.json(types);
        } catch (error) {
            console.error('Error getting station types:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    getFuelTypes = async (_req: Request, res: Response): Promise<void> => {
        try {
            const types = await this.stationService.getFuelTypes();
            res.json(types);
        } catch (error) {
            console.error('Error getting fuel types:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
}