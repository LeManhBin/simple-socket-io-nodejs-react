const { createServer } = require("http");
const { Server } = require("socket.io");

// Create an HTTP server
const httpServer = createServer();

// Create a new instance of socket.io server and pass the HTTP server instance
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let scores = [];

// Event listener for new connections in server socket IO
io.on("connection", (socket) => {
  // Emit the current score list to the new client
  socket.emit("scoreList", scores);

  // Event listener for receiving new scores from clients
  socket.on("score", (res) => {
    const newScore = { ...res, id: new Date().getTime(), socketId: socket.id };
    scores.push(newScore);

    // Broadcast the updated score list to all connected clients
    io.emit("scoreList", scores);
  });

  // Event listener for client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

httpServer.listen(8080, () => {
  console.log("Server is connected");
});
