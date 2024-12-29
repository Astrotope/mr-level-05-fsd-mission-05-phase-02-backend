export interface Location {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
}

export interface Pricing {
    'ZX premium': string;
    'Z91 unleaded': string;
    'Z diesel': string;
    'EV charging': string;
    [key: string]: string;
}

export interface ServiceStation {
    _id?: string;
    name: string;
    address: string;
    location: Location;
    features: string[];
    fuelTypes: string[];
    stationType: string;
    pricing: Pricing;
}

export interface SearchParams {
    latitude: number;
    longitude: number;
    maxDistance?: number;
    fuelType?: string;
    features?: string[];
    stationType?: string;
    sortBy?: 'distance' | 'price';
    limit?: number;  // Added limit parameter
}
