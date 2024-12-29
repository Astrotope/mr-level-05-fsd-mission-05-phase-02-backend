# Service Stations API Test Documentation

This document describes the test cases implemented in `test-api.js` and explains how the geographical search functionality works.

## Test Cases

### 1. Three Closest Stations to Location
```
GET http://localhost:3111/api/stations/search?latitude=-36.8485&longitude=174.7633&maxDistance=100000&limit=3
```
This test finds the three service stations closest to Auckland CBD. It uses MongoDB's geospatial queries to calculate distances from the specified coordinates.

**Parameters:**
- `latitude`: -36.8485 (Auckland CBD)
- `longitude`: 174.7633 (Auckland CBD)
- `maxDistance`: 100000 meters (100km radius)
- `limit`: 3 results

### 2. Three Cheapest Z91 Stations Within 5km
```
GET http://localhost:3111/api/stations/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=Z91%20unleaded&sortBy=price&limit=3
```
This test finds the three cheapest stations selling Z91 unleaded fuel within 5km of Auckland CBD. It combines geospatial search with price sorting.

**Parameters:**
- `latitude`: -36.8485 (Auckland CBD)
- `longitude`: 174.7633 (Auckland CBD)
- `maxDistance`: 5000 meters (5km radius)
- `fuelType`: Z91 unleaded
- `sortBy`: price (sorts results by fuel price)
- `limit`: 3 results

### 3. Three Closest EV Charging Stations
```
GET http://localhost:3111/api/stations/search?latitude=-36.8485&longitude=174.7633&maxDistance=100000&fuelType=EV%20charging&limit=3
```
This test locates the three closest stations that offer EV charging facilities.

**Parameters:**
- `latitude`: -36.8485 (Auckland CBD)
- `longitude`: 174.7633 (Auckland CBD)
- `maxDistance`: 100000 meters (100km radius)
- `fuelType`: EV charging
- `limit`: 3 results

### 4. Three Cheapest EV Charging Stations Within 5km
```
GET http://localhost:3111/api/stations/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=EV%20charging&sortBy=price&limit=3
```
This test finds the three cheapest EV charging stations within 5km of Auckland CBD.

**Parameters:**
- `latitude`: -36.8485 (Auckland CBD)
- `longitude`: 174.7633 (Auckland CBD)
- `maxDistance`: 5000 meters (5km radius)
- `fuelType`: EV charging
- `sortBy`: price
- `limit`: 3 results

## Understanding Geographical Search

### MongoDB Geospatial Queries

The API uses MongoDB's geospatial features to perform location-based searches. Here's how it works:

1. **Data Structure**
   - Station locations are stored in GeoJSON format
   - Each station document contains a location field:
   ```json
   {
     "location": {
       "type": "Point",
       "coordinates": [longitude, latitude]
     }
   }
   ```

2. **2dsphere Index**
   - MongoDB uses a `2dsphere` index for geospatial queries
   - This index is created during database initialization:
   ```javascript
   db.stations.createIndex({ location: "2dsphere" });
   ```

3. **$near Operator**
   - The API uses MongoDB's `$near` operator for proximity searches
   - Example query:
   ```javascript
   {
     location: {
       $near: {
         $geometry: {
           type: "Point",
           coordinates: [longitude, latitude]
         },
         $maxDistance: maxDistance
       }
     }
   }
   ```

4. **Distance Calculation**
   - Distances are calculated as the shortest path over the earth's surface
   - Uses the spherical model, taking into account the earth's curvature
   - Results are automatically sorted by distance when using `$near`

### Combining Geospatial and Price Queries

For tests that combine location and price:
1. First, the API finds stations within the specified radius
2. Then, it filters for stations with the required fuel type
3. Finally, it sorts results by price if requested

This two-step process ensures that:
- All results are within the specified distance
- Price sorting is accurate for the specific fuel type
- Results respect both geographical and price constraints
