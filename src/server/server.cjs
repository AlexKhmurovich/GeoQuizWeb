const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

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

// Active game sessions
const gameSessions = new Map();

// Load country data for generating questions
const countryDataPath = path.join(__dirname, "../CountryData.json");
const CountryData = JSON.parse(fs.readFileSync(countryDataPath, "utf8"));

// Function to get a random country index
function getRandomCountryIndex() {
   return Math.floor(Math.random() * CountryData.length);
}

// Function to create a new game session
function createGameSession(player1Id, player2Id, mode) {
   const sessionId = `${player1Id}-${player2Id}`;

   const gameSession = {
      players: [player1Id, player2Id],
      currentCountryIndex: getRandomCountryIndex(),
      mode: mode || "Flags", // Default to Flags if not specified
      usedCountries: [],
      timerActive: false,
   };

   gameSessions.set(sessionId, gameSession);
   return sessionId;
}

// Function to get the next country (avoiding repeats)
function getNextCountry(sessionId) {
   const session = gameSessions.get(sessionId);
   if (!session) return null;

   // Track the current country as used
   if (!session.usedCountries.includes(session.currentCountryIndex)) {
      session.usedCountries.push(session.currentCountryIndex);
   }

   // If we've used most countries, reset (leaving a few to avoid immediate repeats)
   if (session.usedCountries.length >= CountryData.length - 10) {
      session.usedCountries = session.usedCountries.slice(-5); // Keep the last 5
   }

   // Find an unused country
   let newIndex;
   do {
      newIndex = getRandomCountryIndex();
   } while (session.usedCountries.includes(newIndex));

   session.currentCountryIndex = newIndex;
   return CountryData[newIndex];
}

io.on("connection", (socket) => {
   console.log("A user connected:", socket.id);

   let playerSessionId = null;

   // When a player looks for an opponent
   socket.on("lookForOpponent", (playerInfo) => {
      const { name, mode } =
         typeof playerInfo === "object"
            ? playerInfo
            : { name: playerInfo, mode: "Flags" };
      console.log(`${name} is looking for an opponent in ${mode} mode`);

      // Check if there's already a player waiting
      if (waitingPlayers.length > 0) {
         // Match with the first waiting player
         const opponent = waitingPlayers.shift();

         // Create a game session for these two players
         const sessionId = createGameSession(
            socket.id,
            opponent.socketId,
            mode
         );

         // Store session ID for both players
         socket.data.sessionId = sessionId;
         const opponentSocket = io.sockets.sockets.get(opponent.socketId);
         if (opponentSocket) {
            opponentSocket.data.sessionId = sessionId;
         }

         // Get the first country for the game
         const country =
            CountryData[gameSessions.get(sessionId).currentCountryIndex];

         // Notify both players about the match and send initial question
         socket.emit("opponentFound", {
            name: opponent.name,
            country: country,
            mode: mode,
            sessionId: sessionId,
         });

         io.to(opponent.socketId).emit("opponentFound", {
            name: name,
            country: country,
            mode: mode,
            sessionId: sessionId,
         });

         console.log(
            `Matched ${name} with ${opponent.name} in session ${sessionId}`
         );
      } else {
         // Add this player to the waiting queue
         waitingPlayers.push({
            socketId: socket.id,
            name: name,
            mode: mode,
         });

         // Let the player know they're waiting
         socket.emit("waiting");
         console.log(`${name} added to waiting queue for ${mode} mode`);
      }
   });

   // When a player answers and requests the next question
   socket.on("playerAnswered", () => {
      const sessionId = socket.data.sessionId;
      if (!sessionId) return;

      const session = gameSessions.get(sessionId);
      if (!session || session.timerActive) return;

      session.timerActive = true;

      // Notify both players that the timer has started
      session.players.forEach((playerId) => {
         io.to(playerId).emit("timerStarted");
      });

      // Wait 5 seconds and then move to next question
      setTimeout(() => {
         if (!gameSessions.has(sessionId)) return; // Session might have ended

         session.timerActive = false;

         // Get next country and send to both players
         const nextCountry = getNextCountry(sessionId);
         if (nextCountry) {
            session.players.forEach((playerId) => {
               io.to(playerId).emit("newQuestion", {
                  country: nextCountry,
                  mode: session.mode,
               });
            });
         }
      }, 5000);
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

      // Handle disconnection from active game
      if (playerSessionId) {
         const session = gameSessions.get(playerSessionId);
         if (session) {
            // Notify the other player that their opponent disconnected
            const otherPlayerId = session.players.find(
               (id) => id !== socket.id
            );
            if (otherPlayerId) {
               io.to(otherPlayerId).emit("opponentDisconnected");
            }

            // Remove the game session
            gameSessions.delete(playerSessionId);
         }
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
