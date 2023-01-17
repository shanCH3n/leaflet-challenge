// Create function to display location of earthquakes
function createMap(EQuakeLoc) {
    
    //// Create tile layer that wull be background of our map
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    let baseMaps = {
        "Street Map": streetmap
    };

    let overlayMaps = {
        "Earthquakes": EQuakeLoc
    };
    
    // Create the map object with options. Centred on Australia
    let myMap = L.map("map", {
    center: [-25.274398, 133.775136],
    zoom: 5,
    layers: [streetmap, EQuakeLoc]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer contol to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}


// Load the GeoJSON data.
let earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Function to create markers

function createMarkers(response) {

    // Pull "features" property from response.features
    let earthquakes = response.features;

    // Initialize an array to hold coordinates of earthquakes
    let quakeMarkers = [];

    // Loop through the earthquakes array.
    for (let index = 0; index < earthquakes.length; index++) {
        let earthquake = earthquakes[index];
        // For each earthquake location, create a circle marker, and bind a popup to be populated with its Magnitude, Depth and Location.
        let quakeMarker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]])
            .bindPopup(`<h3>Location: ${earthquake.properties.place}<br>Magnitude: ${earthquake.properties.mag}</h3>`);
        // Add the marker to the quakeMarkers array.
        quakeMarkers.push(quakeMarkers);
    }
    // Create a layer group that's made from the quakeMarkers array, and pass it to the createMap function.
    createMap(L.layerGroup(quakeMarkers));
}

// Get the data with d3. Call createMarkers when it completes
d3.json(earthquake_url).then(createMarkers);


// features.geometry.coordinates[0] = longitude
// features.geometry.coordinates[1] = latitude
// features.geometry.coordinates[2] = depth
// features.properties.mag
// features.properties.place
// Activity 07 in Lession 15.1 for code on circles
// Activity 04 in Lession 15.2 for Legend Code