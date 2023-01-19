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
            color: 'black',
            fillColor: DepthColor(feature.geometry.coordinates[2]),
            weight: 0.5,
            opacity: 0.8,
            fillOpacity: 0.75
            
        }
        return L.circleMarker(layer, options);
    }

    // Radius of circle marker varies with magnitude - range [-1.0, 10.0]
    function MagRad(magnitude) {
        if (magnitude === 0) { // Account for Earthquakes with magnitude of 0 or less
            return 1;
        }
        return magnitude * 5;
    }

    // Colour of circle marker varies with depth - range: [0,1000]
    function DepthColor(depth) {
        if (depth > 90) {
            return "#5c5c8a";
        }
        if (depth >= 70 && depth <= 90) {
            return "#aa80ff";
        }
        if (depth >= 50 && depth < 70) {
            return "#cc99ff";
        }
        if (depth >= 30 && depth < 50) {
            return "#ff9999";
        }
        if (depth >= 10 && depth < 30) {
            return "#ffcc99";
        }
        else {
            return "#ffff99";
        }
    }


    // Create a GeoJSON layer containing the feature array on the earthquake data object.
    // Run the onEachFeature function once for each piece of data in the array
    // Try creating a function with Earthquakes > Magnitude 8 TBC
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

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });


    // Define baseMaps object to hold base layers
    var baseMaps = {
        "Street Map View": streetmap,
        "Nat Geo View": natgeo,
        "Topographical View": topo
    };

    // Create overlayMaps object to hold overlay layers
    var overLayMaps = {
        "Earthquakes": earthquakes
    };
    
    // Create map object centred on Australia
    var myMap = L.map("map", { // reference to div id in html
        center: [-25.274398, 133.775136],
        zoom: 3,
        layers: [streetmap, earthquakes] // Default map
    });

    // Create layer control
    L.control.layers(baseMaps, overLayMaps, {
        collapsed: false
    }).addTo(myMap);

    
    // Create Legend - Refer to L15.2 Activity 04
   var legend = L.control({position: "bottomright"});

    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let limits = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
        let colors = ['#ffff99', '#ffcc99', '#ff9999', '#cc99ff', '#aa80ff', '#5c5c8a'];
        var labels = [];

        // Add the minimum and maximum
        // TBC Add Legend Title  "<h1>Earthquake Depth (KM)</h1>" + 
        let legendInfo = 
        "<div class=\"labels\">" + 
        "</div>";
        
        div.innerHTML = legendInfo;

        // Loop through depth limits and generate a label with a coloured square to represent each grade.
        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "; width: 20px" + "; height: 20px" + "\"></li>" + limit);
          });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // Add the legend to the map 
    legend.addTo(myMap);

});

