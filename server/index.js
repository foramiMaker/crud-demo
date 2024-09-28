const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const UserRoute = require("./routes/product.route.js");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// Create an HTTP server for the Express app
const server = http.createServer(app);

// Initialize Socket.IO server on the existing HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust this to your frontend's URL
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/api/users", UserRoute);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log(`Client connected ${socket.id}`);

  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log("Received query:", message);
    socket.broadcast.emit("received query", message);
  });

  // Handle client disconnection
  socket.on("disconnect", (reason) => {
    console.log(`Client disconnected with reason: ${reason}`);
  });
});

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("Connected to MongoDB!");
    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
    });
  })
  .catch((error) => {
    console.log("Connection failed:", error);
  });
