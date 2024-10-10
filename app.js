const express = require('express');
const path = require('path'); // Import path module
const app = express();
const port = 3011;
const http = require("http");
const socketio = require("socket.io");

// Create an HTTP server
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = socketio(server);

// Set EJS as the view engine
app.set("view engine", "ejs");

// Set the public directory for static files
app.use(express.static(path.join(__dirname, "public"))); // Use `app.use` instead of `app.set`

// Serve a simple text response on the root route
app.get('/', (req, res) => {
    res.render("index");
});

// Set up Socket.IO connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for location updates from the client
    socket.on("send-location", (data) => {
        // Emit the location data to all connected clients
        io.emit("receive-location", { id: socket.id, ...data });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
