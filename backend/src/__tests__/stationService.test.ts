import { Collection, Db } from 'mongodb';
import { StationService } from '../services/stationService';
import { ServiceStation } from '../types/station';

describe('StationService', () => {
    let service: StationService;
    let mockCollection: Partial<Collection<ServiceStation>>;
    let mockDb: Partial<Db>;

    beforeEach(() => {
        mockCollection = {
            find: jest.fn(),
            distinct: jest.fn()
        };

        mockDb = {
            collection: jest.fn().mockReturnValue(mockCollection)
        };

        service = new StationService(mockDb as Db);
    });

    describe('findNearestStations', () => {
        it('should query stations with correct parameters', async () => {
            const mockStations = [
                {
                    name: 'Test Station',
                    location: { type: 'Point', coordinates: [174.7, -36.8] },
                    pricing: { 'Z01 unleaded': '2.50' }
                }
            ];

            const mockFind = {
                limit: jest.fn().mockReturnThis(),
                toArray: jest.fn().mockResolvedValue(mockStations)
            };

            (mockCollection.find as jest.Mock).mockReturnValue(mockFind);

            const result = await service.findNearestStations({
                latitude: -36.8,
                longitude: 174.7
            });

            expect(mockCollection.find).toHaveBeenCalledWith(expect.objectContaining({
                location: expect.objectContaining({
                    $near: expect.objectContaining({
                        $geometry: {
                            type: 'Point',
                            coordinates: [174.7, -36.8]
                        }
                    })
                })
            }));

            expect(result).toEqual(mockStations);
        });
    });

    describe('getStationFeatures', () => {
        it('should return distinct features', async () => {
            const mockFeatures = ['Feature1', 'Feature2'];
            (mockCollection.distinct as jest.Mock).mockResolvedValue(mockFeatures);

            const result = await service.getStationFeatures();

            expect(mockCollection.distinct).toHaveBeenCalledWith('features');
            expect(result).toEqual(mockFeatures);
        });
    });
});
