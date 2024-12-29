const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function loadData() {
    const client = new MongoClient('mongodb://localhost:27017');
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('service_stations');
        
        // Read the JSON file
        const dataPath = path.join(__dirname, '../../dataset/z-energy-stations.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);
        const stationsData = data.stations;

        // Function to generate random price within range
        function generateRandomPrice() {
            return (Math.random() * 3.50).toFixed(2);
        }

        // Process the data
        const processedStations = stationsData.map(station => ({
            ...station,
            pricing: {
                "ZX premium": generateRandomPrice(),
                "Z01 unleaded": generateRandomPrice(),
                "Z diesel": generateRandomPrice(),
                "EV charging": generateRandomPrice()
            },
            location: station.coordinates ? {
                type: "Point",
                coordinates: [parseFloat(station.coordinates.longitude), parseFloat(station.coordinates.latitude)]
            } : null
        }));

        // Clear existing data
        await db.collection('stations').deleteMany({});
        
        // Insert the data
        const result = await db.collection('stations').insertMany(processedStations);
        console.log(`Inserted ${result.insertedCount} documents`);

        // Create indexes
        await db.collection('stations').createIndex({ location: "2dsphere" });
        await db.collection('stations').createIndex({ "pricing.ZX premium": 1 });
        await db.collection('stations').createIndex({ "pricing.Z01 unleaded": 1 });
        await db.collection('stations').createIndex({ "pricing.Z diesel": 1 });
        await db.collection('stations').createIndex({ "pricing.EV charging": 1 });
        console.log('Created indexes');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

loadData();
