const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Add CORS options to allow socket connections
const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"],
   },
});

// Serve static files
app.use(express.static(path.join(__dirname, "../../dist")));

// Ensure the server correctly serves the main HTML file for all routes
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Game rooms by mode
const rooms = {
   Flags: [],
   Shapes: [],
   Capitals: [],
   Countries: [],
   Domains: [],
   Anthems: [],
};

// Active games
const activeGames = {};

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);

   // Player joins waiting room
   socket.on("joinGame", ({ playerName, mode }) => {
      console.log(`${playerName} wants to join ${mode} mode`);

      // Look for an available room
      let room = rooms[mode].find((r) => r.players.length === 1);

      if (room) {
         // Join existing room
         room.players.push({
            id: socket.id,
            name: playerName,
            lives: 3,
            score: 0,
         });
         socket.join(room.id);

         // Notify both players that game is starting
         const opponent = room.players[0];

         // Send info to new player about opponent
         socket.emit("opponentJoined", { opponentName: opponent.name });

         // Send info to first player about new opponent
         io.to(opponent.id).emit("opponentJoined", {
            opponentName: playerName,
         });

         // Start game for both players
         const gameData = {
            roomId: room.id,
            players: room.players,
            currentQuestion: 0,
         };

         activeGames[room.id] = gameData;
         io.to(room.id).emit("gameStart", gameData);

         // Remove room from waiting list
         rooms[mode] = rooms[mode].filter((r) => r.id !== room.id);
      } else {
         // Create new room
         const roomId = `${mode}-${Date.now()}`;
         const newRoom = {
            id: roomId,
            mode: mode,
            players: [{ id: socket.id, name: playerName, lives: 3, score: 0 }],
         };

         rooms[mode].push(newRoom);
         socket.join(roomId);
         socket.emit("waitingForOpponent");
      }
   });

   // Player submits an answer
   socket.on("submitAnswer", ({ roomId, isCorrect }) => {
      const game = activeGames[roomId];

      if (!game) return;

      // Find the player
      const player = game.players.find((p) => p.id === socket.id);
      if (!player) return;

      // Update score and lives
      if (isCorrect) {
         player.score += 1;
      } else {
         player.lives -= 1;
      }

      // Check if player has answered
      player.hasAnswered = true;

      const allAnswered = game.players.every((p) => p.hasAnswered);
      const someoneOutOfLives = game.players.some((p) => p.lives <= 0);

      // If all players answered or someone is out of lives
      if (allAnswered || someoneOutOfLives) {
         // Reset the answered state for the next question
         game.players.forEach((p) => (p.hasAnswered = false));

         // Check if game is over
         if (someoneOutOfLives) {
            // Find the winner (player with lives remaining)
            const winner =
               game.players.find((p) => p.lives > 0) || game.players[0];
            io.to(roomId).emit("gameOver", {
               players: game.players,
               winnerId: winner.id,
               winnerName: winner.name,
            });

            // Clean up the game
            delete activeGames[roomId];
         } else {
            // Move to next question
            game.currentQuestion++;
            io.to(roomId).emit("nextQuestion", {
               players: game.players,
               currentQuestion: game.currentQuestion,
            });
         }
      } else {
         // Start countdown for other player
         const opponent = game.players.find((p) => p.id !== socket.id);
         io.to(opponent.id).emit("opponentAnswered", { timeLeft: 5 });

         // Notify the player who answered
         socket.emit("waitingForOpponent");
      }
   });

   // Force next question when time runs out
   socket.on("timeUp", ({ roomId }) => {
      const game = activeGames[roomId];
      if (!game) return;

      // Find the player who didn't answer
      const player = game.players.find((p) => !p.hasAnswered);
      if (player) {
         player.hasAnswered = true;
         player.lives -= 1; // Penalty for not answering in time

         // Check if player is out of lives
         if (player.lives <= 0) {
            const winner = game.players.find((p) => p.id !== player.id);
            io.to(roomId).emit("gameOver", {
               players: game.players,
               winnerId: winner.id,
               winnerName: winner.name,
            });

            // Clean up the game
            delete activeGames[roomId];
         } else {
            // Move to next question
            game.players.forEach((p) => (p.hasAnswered = false));
            game.currentQuestion++;
            io.to(roomId).emit("nextQuestion", {
               players: game.players,
               currentQuestion: game.currentQuestion,
            });
         }
      }
   });

   // Handle disconnections
   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Check if player is in a waiting room
      for (const mode in rooms) {
         rooms[mode] = rooms[mode].filter((room) => {
            const playerIndex = room.players.findIndex(
               (p) => p.id === socket.id
            );
            if (playerIndex !== -1) {
               room.players.splice(playerIndex, 1);
               return false; // Remove empty rooms
            }
            return true;
         });
      }

      // Check if player is in an active game
      for (const roomId in activeGames) {
         const game = activeGames[roomId];
         const playerIndex = game.players.findIndex((p) => p.id === socket.id);

         if (playerIndex !== -1) {
            // Notify other player that opponent left
            const opponent = game.players.find((p) => p.id !== socket.id);
            if (opponent) {
               io.to(opponent.id).emit("opponentLeft");
            }

            // Clean up the game
            delete activeGames[roomId];
         }
      }
   });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

module.exports = app;
