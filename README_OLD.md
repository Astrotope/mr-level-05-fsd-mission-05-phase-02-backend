# Service Stations Search API

A TypeScript-based Express.js API for searching service stations based on location, pricing, and features. The API uses MongoDB for data storage and is containerized using Docker.

## Features

- Geospatial search for finding nearest service stations
- Search by fuel prices (cheapest options)
- Filter by station features and fuel types
- Docker setup with development and production profiles
- MongoDB with automatic data initialization
- TypeScript support with Jest testing framework

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- npm or yarn

## Getting Started

1. Clone the repository
2. Copy the environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start the development environment:
   ```bash
   docker compose --profile development up
   ```

   Or for production:
   ```bash
   docker compose --profile production up
   ```

## Development

The development environment uses volume mapping for:
- Live code reloading with nodemon
- Database persistence
- Easy updates to station data

## Testing

Run the test suite:
```bash
cd backend
npm test
```

## API Documentation

Coming soon...
