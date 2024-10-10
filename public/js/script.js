const socket = io(); // Initialize Socket.IO

if (navigator.geolocation) {
    // Get the current position first
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit the initial position to the server
            socket.emit('send-location', { lat: latitude, lng: longitude });
            console.log(`Initial Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
            console.error("Error obtaining initial location:", error);
        },
        {
            enableHighAccuracy: true, // High accuracy
            timeout: 10000,           // Wait time for the position
            maximumAge: 0             // No caching
        }
    );

    // Watch the user's position
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;

            // Emit the updated position to the server
            socket.emit('send-location', { lat: latitude, lng: longitude });
            console.log(`Updated Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
            console.error("Error obtaining location:", error);
        },
        {
            enableHighAccuracy: true, // High accuracy
            timeout: 10000,           // Wait time for the position
            maximumAge: 0             // No caching
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

// Initialize the Leaflet map
const map = L.map("map").setView([0, 0], 10);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 29,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Object to hold markers by user ID
const markers = {};

// Handle incoming location updates from the server
socket.on("receive-location", (data) => {
    const { id, lat, lng } = data;

    // If the marker for this user already exists, update its position
    if (markers[id]) {
        markers[id].setLatLng([lat, lng]);
    } else {
        // Create a new marker and add it to the map
        const marker = L.marker([lat, lng]).addTo(map).bindPopup(`User ID: ${id}`);
        markers[id] = marker; // Store the marker in the markers object
    }

    // Optionally, set the view to the updated location
    map.setView([lat, lng], 16); // Adjust the zoom level as necessary
});
