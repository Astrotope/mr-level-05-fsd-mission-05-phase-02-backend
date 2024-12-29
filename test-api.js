import fetch from 'node-fetch';
import chalk from 'chalk';

const BASE_URL = 'http://localhost:3111/api/stations';
const AUCKLAND_CBD = {
    latitude: -36.8485,
    longitude: 174.7633
};

// Helper function to format price
const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

// Helper function to format station info
const formatStation = (station, fuelType) => {
    return `${chalk.blue(station.name)} - ${chalk.green(formatPrice(station.pricing[fuelType]))}`;
};

async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(chalk.red('Error fetching data:', error.message));
        return [];
    }
}

async function runTests() {
    console.log(chalk.yellow('\n=== Testing Service Stations API ===\n'));

    // Test 1: Three closest stations
    console.log(chalk.cyan('1. Three closest stations to Auckland CBD:'));
    const closestStations = await fetchData(
        `${BASE_URL}/search?latitude=${AUCKLAND_CBD.latitude}&longitude=${AUCKLAND_CBD.longitude}&maxDistance=100000&limit=3`
    );
    closestStations.forEach(station => {
        console.log(`- ${chalk.blue(station.name)}`);
    });

    // Test 2: Three cheapest Z91 stations within 5km
    console.log(chalk.cyan('\n2. Three cheapest Z91 stations within 5km:'));
    const cheapestZ91 = await fetchData(
        `${BASE_URL}/search?latitude=${AUCKLAND_CBD.latitude}&longitude=${AUCKLAND_CBD.longitude}&maxDistance=5000&fuelType=Z91%20unleaded&sortBy=price&limit=3`
    );
    cheapestZ91.forEach(station => {
        console.log(`- ${formatStation(station, 'Z91 unleaded')}`);
    });

    // Test 3: Three closest EV charging stations
    console.log(chalk.cyan('\n3. Three closest EV charging stations:'));
    const closestEV = await fetchData(
        `${BASE_URL}/search?latitude=${AUCKLAND_CBD.latitude}&longitude=${AUCKLAND_CBD.longitude}&maxDistance=100000&fuelType=EV%20charging&limit=3`
    );
    closestEV.forEach(station => {
        console.log(`- ${formatStation(station, 'EV charging')}`);
    });

    // Test 4: Three cheapest EV charging stations within 5km
    console.log(chalk.cyan('\n4. Three cheapest EV charging stations within 5km:'));
    const cheapestEV = await fetchData(
        `${BASE_URL}/search?latitude=${AUCKLAND_CBD.latitude}&longitude=${AUCKLAND_CBD.longitude}&maxDistance=5000&fuelType=EV%20charging&sortBy=price&limit=3`
    );
    cheapestEV.forEach(station => {
        console.log(`- ${formatStation(station, 'EV charging')}`);
    });
}

runTests().catch(error => {
    console.error(chalk.red('Error running tests:', error.message));
});
