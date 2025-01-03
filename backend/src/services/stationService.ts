import { Collection, Db } from 'mongodb';
import { ServiceStation, SearchParams } from '../types/station.js';

export class StationService {
    private collection: Collection<ServiceStation>;

    constructor(db: Db) {
        this.collection = db.collection('stations');
        // Add initial check for data
        this.checkDatabaseContent();
    }

    async getStationCount(): Promise<number> {
        return this.collection.countDocuments();
    }

    private async checkDatabaseContent() {
        const count = await this.collection.countDocuments();
        console.log(`Database contains ${count} stations`);
        if (count > 0) {
            const sample = await this.collection.findOne({});
            console.log('Sample station document:', JSON.stringify(sample, null, 2));
        }
    }

    async findNearestStations(params: SearchParams): Promise<ServiceStation[]> {
        const { 
            latitude, 
            longitude, 
            maxDistance = 10000, 
            fuelType, 
            features, 
            stationType, 
            sortBy = 'distance',
            limit = 10  // Default to 10 if not specified
        } = params;

        console.log('Search parameters:', JSON.stringify(params, null, 2));

        const query: any = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            }
        };

        if (features?.length) {
            // Search in services array instead of features
            query['services.name'] = { $in: features };
        }

        if (stationType) {
            query.stationType = stationType;
        }

        if (fuelType) {
            query[`pricing.${fuelType}`] = { $exists: true };
        }

        console.log('MongoDB query:', JSON.stringify(query, null, 2));

        const stations = await this.collection
            .find(query)
            .limit(limit)  // Use the limit parameter here
            .toArray();

        console.log(`Found ${stations.length} stations`);

        if (sortBy === 'price' && fuelType) {
            stations.sort((a, b) => {
                const priceA = parseFloat(a.pricing[fuelType]);
                const priceB = parseFloat(b.pricing[fuelType]);
                return priceA - priceB;
            });
            // Re-apply limit after sorting by price
            return stations.slice(0, limit);
        }

        return stations;
    }

    async findCheapestStations(fuelType: string, limit: number = 10): Promise<ServiceStation[]> {
        const query: any = {
            [`pricing.${fuelType}`]: { $exists: true }
        };

        console.log('MongoDB query:', JSON.stringify(query, null, 2));

        return this.collection
            .find(query)
            .sort({ [`pricing.${fuelType}`]: 1 })
            .limit(limit)
            .toArray();
    }

    async getStationFeatures(): Promise<string[]> {
        // Get unique service names instead of features
        return this.collection.distinct('services.name');
    }

    async getStationTypes(): Promise<string[]> {
        return this.collection.distinct('stationType');
    }

    async getFuelTypes(): Promise<string[]> {
        // Get fuel types from the pricing object keys
        const sample = await this.collection.findOne({});
        if (!sample?.pricing) return [];
        return Object.keys(sample.pricing);
    }
}