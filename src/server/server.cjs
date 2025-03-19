const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: "*", // In production, specify your client's domain
      methods: ["GET", "POST"],
   },
});

// Serve static files from the build directory in production
app.use(express.static(path.join(__dirname, "../../dist")));

// Queue of players waiting for a match
const waitingPlayers = [];

io.on("connection", (socket) => {
   console.log("A user connected:", socket.id);

   // When a player looks for an opponent
   socket.on("lookForOpponent", (playerName) => {
      console.log(`${playerName} is looking for an opponent`);

      // Check if there's already a player waiting
      if (waitingPlayers.length > 0) {
         // Match with the first waiting player
         const opponent = waitingPlayers.shift();

         // Notify both players about the match
         socket.emit("opponentFound", opponent.name);
         io.to(opponent.socketId).emit("opponentFound", playerName);

         console.log(`Matched ${playerName} with ${opponent.name}`);
      } else {
         // Add this player to the waiting queue
         waitingPlayers.push({
            socketId: socket.id,
            name: playerName,
         });

         // Let the player know they're waiting
         socket.emit("waiting");
         console.log(`${playerName} added to waiting queue`);
      }
   });

   // Handle disconnections
   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove player from waiting queue if they disconnect
      const index = waitingPlayers.findIndex(
         (player) => player.socketId === socket.id
      );
      if (index !== -1) {
         console.log(
            `Removing ${waitingPlayers[index].name} from waiting queue`
         );
         waitingPlayers.splice(index, 1);
      }
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

// Always return the main index.html for client-side routing
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "../../dist/index.html"));
});
