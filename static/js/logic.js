// Leaflet-Part-1

// Store url to Earthquake data
// Examine all Earthquakes in the past month
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the URL
d3.json(url).then(function (data) {
    // Define a series of functions for each feature of the visualisation.
    // Give each feature a popup displaying the place, magnitude, depth and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location: ${feature.properties.place}<br>
        Magnitude: ${feature.properties.mag}<br>
        Depth: ${feature.geometry.coordinates[2]}</h3>
        <hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Create a circle marker for each earthquake
    function createCircleMarker(feature, layer) {
        let options = {
            radius: MagRad(feature.properties.mag),
            color: DepthColor(feature.geometry.coordinates[2]),
            weight: 1,
            opacity: 0.75,
            fillOpacity: 0.40
            
        }
        return L.circleMarker(layer, options);
    }

    // Radius of circle marker varies with magnitude - range [-1.0, 10.0]
    function MagRad(magnitude) {
        if (magnitude === 0) { //Scaling for Earthquakes with magnitude of 0 or less
            return 1;
        }
        return magnitude * 5;
    }

    // Colour of circle marker varies with depth - range: [0,1000]
    function DepthColor(depth) {
        if (depth > 90) {
            return "#330000";
        }
        if (depth > 80) {
            return "#660000";
        }
        if (depth > 70) {
            return "#990000";
        }
        if (depth > 60) {
            return "#CC0000";
        }
        if (depth > 50) {
            return "#CC6600";
        }
        if (depth > 40) {
            return "#FF8000";
        }
        if (depth > 30) {
            return "#FF9933";
        }
        if (depth > 20) {
            return "#FFB266";
        }
        if (depth > 10) {
            return "#FFFF00";
        }
        else {
            return "#FFFF99";
        }
    }


    // Create a GeoJSON layer containing the feature array on the earthquake data object.
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(data.features, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Create base layers
    var streetmap =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var natgeo = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
        maxZoom: 16
    });

    // Define baseMaps object to hold base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Nat Geo View": natgeo
    };

    // Create overlayMaps object to hold overlay layers
    var overLayMaps = {
        "Earthquakes": earthquakes
    };
    
    // Create map object centred on Australia
    var myMap = L.map("map", { // reference to div id in html
        center: [-25.274398, 133.775136],
        zoom: 3,
        layers: [streetmap] // exclude natgeo for now
    });

    // Create layer control
    L.control.layers(baseMaps, overLayMaps, {
        collapsed: false
    }).addTo(myMap);

    
    // Create Legend
   //let legend = L.control({position: "bottomright"});
    //legend.onAdd = function () {
        //let div = L.DomUtil.create("div", "info legend");
        //let colors = 
        //let labels = [];

    //}

    // Add the legend to the map


});


// L.circleMarker
// features.geometry.coordinates[0] = longitude
// features.geometry.coordinates[1] = latitude
// features.geometry.coordinates[2] = depth
// features.properties.mag = Magnitude
// features.properties.place = Place
// Activity 04 in Lession 15.2 for Legend Code