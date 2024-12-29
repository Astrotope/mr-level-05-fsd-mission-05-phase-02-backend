print('Starting MongoDB initialization script...');

// Switch to service_stations database
db = db.getSiblingDB('service_stations');
print('Switched to service_stations database');

try {
    // Create collections
    db.createCollection('stations');
    print('Created stations collection');

    print('Reading JSON file...');
    // Read and parse the JSON file
    const fs = require('fs');
    print('Checking if file exists at /dataset/stations.json');
    if (!fs.existsSync('/dataset/stations.json')) {
        throw new Error('stations.json file not found at /dataset/stations.json');
    }
    
    const fileContent = fs.readFileSync('/dataset/stations.json', 'utf8');
    print('File content length: ' + fileContent.length);
    
    print('Parsing JSON...');
    const jsonData = JSON.parse(fileContent);
    print('JSON parsed successfully. Structure: ' + Object.keys(jsonData).join(', '));
    
    if (!jsonData.stations || !Array.isArray(jsonData.stations)) {
        throw new Error('Invalid data structure. Expected "stations" array, got: ' + typeof jsonData.stations);
    }
    
    const stations = jsonData.stations;
    print('Found ' + stations.length + ' stations');

    print('Validating and transforming station data...');
    const transformedStations = stations.map((station, index) => {
        if (!station.name || !station.type || !station.location) {
            throw new Error(`Invalid station data at index ${index}. Missing required fields.`);
        }

        // Transform location to GeoJSON format
        const longitude = parseFloat(station.location.longitude);
        const latitude = parseFloat(station.location.latitude);
        
        if (isNaN(longitude) || isNaN(latitude)) {
            throw new Error(`Invalid coordinates at index ${index}`);
        }

        // Create a sample pricing object (since we don't have real pricing data)
        const pricing = {};
        station.fuels.forEach(fuel => {
            // Map fuel names to our expected pricing structure
            switch(fuel.name.toLowerCase()) {
                case 'z diesel':
                    pricing['Z diesel'] = (Math.random() * (2.5 - 2.0) + 2.0).toFixed(2);
                    break;
                case 'z91 unleaded':
                    pricing['Z91 unleaded'] = (Math.random() * (3.0 - 2.5) + 2.5).toFixed(2);
                    break;
                case 'zx premium':
                    pricing['ZX premium'] = (Math.random() * (3.5 - 3.0) + 3.0).toFixed(2);
                    break;
            }
        });
        
        // Add EV charging if it's in the services
        const hasEVCharging = station.services.some(service => 
            service.name.toLowerCase().includes('ev') || 
            service.name.toLowerCase().includes('electric') ||
            service.code.toLowerCase().includes('ev') ||
            service.code.toLowerCase().includes('electric')
        );
        
        if (hasEVCharging) {
            pricing['EV charging'] = (Math.random() * (0.50 - 0.30) + 0.30).toFixed(2);
            console.log(`Added EV charging price for station: ${station.name}`);
        }

        return {
            ...station,
            stationType: station.type,  // Rename type to stationType
            location: {
                type: "Point",
                coordinates: [longitude, latitude],
                address: station.location.address,
                suburb: station.location.suburb,
                city: station.location.city,
                region: station.location.region,
                postcode: station.location.postcode
            },
            pricing: pricing
        };
    });

    print('Processing stations data...');
    
    print('Inserting stations data...');
    // Insert the stations data
    const insertResult = db.stations.insertMany(transformedStations);
    print('Insert result: ' + JSON.stringify(insertResult));

    print('Creating indexes...');
    // Create indexes for geospatial queries
    db.stations.createIndex({ location: "2dsphere" });
    db.stations.createIndex({ "pricing.Z91 unleaded": 1 });
    db.stations.createIndex({ "pricing.ZX premium": 1 });
    db.stations.createIndex({ "pricing.Z diesel": 1 });
    db.stations.createIndex({ "pricing.EV charging": 1 });
    print('Indexes created successfully');

    print('MongoDB initialization completed successfully');
} catch (error) {
    print('Error during initialization:');
    print('Error message: ' + error.message);
    print('Error stack: ' + error.stack);
    throw error;
}

// print('Starting MongoDB initialization script...');

// // Switch to service_stations database
// db = db.getSiblingDB('service_stations');
// print('Switched to service_stations database');

// try {
//     // Create collections
//     db.createCollection('stations');
//     print('Created stations collection');

//     print('Reading JSON file...');
//     // Read and parse the JSON file
//     const fs = require('fs');
//     print('Checking if file exists at /dataset/stations.json');
//     if (!fs.existsSync('/dataset/stations.json')) {
//         throw new Error('stations.json file not found at /dataset/stations.json');
//     }
    
//     const fileContent = fs.readFileSync('/dataset/stations.json', 'utf8');
//     print('File content length: ' + fileContent.length);
    
//     print('Parsing JSON...');
//     const jsonData = JSON.parse(fileContent);
//     print('JSON parsed successfully. Structure: ' + Object.keys(jsonData).join(', '));
    
//     if (!jsonData.stations || !Array.isArray(jsonData.stations)) {
//         throw new Error('Invalid data structure. Expected "stations" array, got: ' + typeof jsonData.stations);
//     }
    
//     const stations = jsonData.stations;
//     print('Found ' + stations.length + ' stations');

//     print('Validating and transforming station data...');
//     const transformedStations = stations.map((station, index) => {
//         if (!station.name || !station.type || !station.location) {
//             throw new Error(`Invalid station data at index ${index}. Missing required fields.`);
//         }

//         // Transform location to GeoJSON format
//         const longitude = parseFloat(station.location.longitude);
//         const latitude = parseFloat(station.location.latitude);
        
//         if (isNaN(longitude) || isNaN(latitude)) {
//             throw new Error(`Invalid coordinates at index ${index}`);
//         }

//         // Create a sample pricing object (since we don't have real pricing data)
//         const pricing = {};
//         station.fuels.forEach(fuel => {
//             // Map fuel names to our expected pricing structure
//             switch(fuel.name.toLowerCase()) {
//                 case 'z diesel':
//                     pricing['Z diesel'] = (Math.random() * (2.5 - 2.0) + 2.0).toFixed(2);
//                     break;
//                 case 'z91 unleaded':
//                     pricing['Z91 unleaded'] = (Math.random() * (3.0 - 2.5) + 2.5).toFixed(2);
//                     break;
//                 case 'zx premium':
//                     pricing['ZX premium'] = (Math.random() * (3.5 - 3.0) + 3.0).toFixed(2);
//                     break;
//             }
//         });
        
//         // Add EV charging if it's in the services
//         if (station.services.some(service => service.name.toLowerCase().includes('ev') || service.name.toLowerCase().includes('electric'))) {
//             pricing['EV charging'] = (Math.random() * (0.50 - 0.30) + 0.30).toFixed(2);
//         }

//         return {
//             ...station,
//             stationType: station.type,  // Rename type to stationType
//             location: {
//                 type: "Point",
//                 coordinates: [longitude, latitude],
//                 address: station.location.address,
//                 suburb: station.location.suburb,
//                 city: station.location.city,
//                 region: station.location.region,
//                 postcode: station.location.postcode
//             },
//             pricing: pricing
//         };
//     });

//     print('Processing stations data...');
    
//     print('Inserting stations data...');
//     // Insert the stations data
//     const insertResult = db.stations.insertMany(transformedStations);
//     print('Insert result: ' + JSON.stringify(insertResult));

//     print('Creating indexes...');
//     // Create indexes for geospatial queries
//     db.stations.createIndex({ location: "2dsphere" });
//     db.stations.createIndex({ "pricing.Z91 unleaded": 1 });
//     db.stations.createIndex({ "pricing.ZX premium": 1 });
//     db.stations.createIndex({ "pricing.Z diesel": 1 });
//     db.stations.createIndex({ "pricing.EV charging": 1 });
//     print('Indexes created successfully');

//     print('MongoDB initialization completed successfully');
// } catch (error) {
//     print('Error during initialization:');
//     print('Error message: ' + error.message);
//     print('Error stack: ' + error.stack);
//     throw error;
// }