#!/bin/bash

# Directory to store test results
RESULTS_DIR="test_results"
mkdir -p $RESULTS_DIR

# Base URL for the API
BASE_URL="http://localhost:3111/api/stations"

echo "Testing Service Stations API..."

# Test 1: Database connection test
echo "Testing database connection..."
curl -s "$BASE_URL/test" | jq '.' > "$RESULTS_DIR/01_connection_test.json"

# Test 2: Search for stations near Auckland CBD
echo "Testing station search near Auckland CBD..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=Z91%20unleaded" | jq '.' > "$RESULTS_DIR/02_auckland_search.json"

# Test 3: Get cheapest stations for Z91 unleaded
echo "Testing cheapest Z91 stations..."
curl -s "$BASE_URL/cheapest/Z91%20unleaded" | jq '.' > "$RESULTS_DIR/03_cheapest_z91.json"

# Test 4: Get all available features
echo "Testing features endpoint..."
curl -s "$BASE_URL/features" | jq '.' > "$RESULTS_DIR/04_features.json"

# Test 5: Get all station types
echo "Testing station types endpoint..."
curl -s "$BASE_URL/types" | jq '.' > "$RESULTS_DIR/05_station_types.json"

# Test 6: Get all fuel types
echo "Testing fuel types endpoint..."
curl -s "$BASE_URL/fuel-types" | jq '.' > "$RESULTS_DIR/06_fuel_types.json"

# Test 7: Search with multiple parameters
echo "Testing advanced search..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=10000&fuelType=Z91%20unleaded&stationType=Service%20Station&sortBy=price" | jq '.' > "$RESULTS_DIR/07_advanced_search.json"

# Test 8: Search for EV stations
echo "Testing EV station search..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=EV%20charging" | jq '.' > "$RESULTS_DIR/08_ev_search.json"

echo "All tests completed. Results saved in $RESULTS_DIR/"

# Test 9: Three closest stations to location (Auckland CBD coordinates)
echo "Testing three closest stations..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=100000&limit=3" | jq '.' > "$RESULTS_DIR/09_three_closest_stations.json"

# Test 10: Three cheapest Z91 stations within 5km
echo "Testing three cheapest Z91 stations within 5km..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=Z91%20unleaded&sortBy=price&limit=3" | jq '.' > "$RESULTS_DIR/10_three_cheapest_z91_nearby.json"

# Test 11: Three closest EV charging stations
echo "Testing three closest EV charging stations..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=100000&fuelType=EV%20charging&limit=3" | jq '.' > "$RESULTS_DIR/11_three_closest_ev.json"

# Test 12: Three cheapest EV charging stations within 5km
echo "Testing three cheapest EV charging stations within 5km..."
curl -s "$BASE_URL/search?latitude=-36.8485&longitude=174.7633&maxDistance=5000&fuelType=EV%20charging&sortBy=price&limit=3" | jq '.' > "$RESULTS_DIR/12_three_cheapest_ev_nearby.json"