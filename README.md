# Service Stations API

A RESTful API service built with Express.js and TypeScript that provides information about service stations, including their locations, fuel prices, and available services.

## Features

- Search for nearest service stations based on location
- Filter stations by fuel type and station type
- Sort results by distance or price
- Get cheapest fuel prices in an area
- View available station features and fuel types
- Supports both development and production environments

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- MongoDB (handled via Docker)

## Getting Started

1. Clone the repository
2. Create a `.env` file in the root directory with the following content:
```env
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
MONGODB_URI=mongodb://root:example@mongodb:27017/service_stations?authSource=admin
PORT=3111
```

3. Place your `stations.json` data file in `backend/dataset/`

### Development Mode

```bash
# Start the development environment
docker compose --profile development up
```

### Production Mode

```bash
# Start the production environment
docker compose --profile production up
```

## API Endpoints

### Search Stations
- `GET /api/stations/search`
  - Query Parameters:
    - `latitude` (required): Latitude coordinate
    - `longitude` (required): Longitude coordinate
    - `maxDistance` (optional): Maximum distance in meters (default: 10000)
    - `fuelType` (optional): Type of fuel to filter by
    - `stationType` (optional): Type of station
    - `sortBy` (optional): Sort by 'distance' or 'price'
    - `limit` (optional): Number of results to return (default: 10)

### Get Cheapest Stations
- `GET /api/stations/cheapest/:fuelType`
  - Parameters:
    - `fuelType`: Type of fuel to search for
  - Query Parameters:
    - `limit` (optional): Number of results to return (default: 10)

### Other Endpoints
- `GET /api/stations/features`: Get all available station features
- `GET /api/stations/types`: Get all station types
- `GET /api/stations/fuel-types`: Get all available fuel types
- `GET /api/stations/test`: Test database connection

## Testing

The API includes a test script that can be run to verify functionality:

```bash
# Install dependencies for the test script
npm install node-fetch chalk

# Run the test script
node test-api.js
```

## Development

The project uses TypeScript and follows a modular architecture:
- `src/routes`: API route definitions
- `src/controllers`: Request handling logic
- `src/services`: Business logic and database operations
- `src/types`: TypeScript type definitions

## Docker Configuration

- Development mode uses volume mounts for hot reloading
- Production mode uses multi-stage builds for optimized container size
- MongoDB data is persisted using Docker volumes

## API Usage and Testing Documentation

[TEST_DOCS.md](TEST_DOCS.md)