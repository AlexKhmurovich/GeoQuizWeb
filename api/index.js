const express = require("express");
const { Server } = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = require("http").createServer(app);
const io = new Server(server, {
   cors: {
      origin: [/\.vercel\.app$/, /localhost/, /\.geoquiz\.pro$/],
      methods: ["GET", "POST"],
      credentials: true,
   },
});

app.use(express.json());

// Queue of players waiting for a match
const waitingPlayers = [];

// Active game sessions
const gameSessions = new Map();

// Load country data for generating questions
const countryDataPath = path.join(__dirname, "../src/CountryData.json");
const CountryData = JSON.parse(fs.readFileSync(countryDataPath, "utf8"));

// Helper functions
function getRandomCountryIndex() {
   return Math.floor(Math.random() * CountryData.length);
}

function createGameSession(player1Id, player2Id, mode) {
   const sessionId = `${player1Id}-${player2Id}`;
   const gameSession = {
      players: [player1Id, player2Id],
      scores: { [player1Id]: 0, [player2Id]: 0 },
      currentCountryIndex: getRandomCountryIndex(),
      mode: mode || "Flags",
      usedCountries: [],
      timerActive: false,
      answeredPlayers: new Set(),
      playerAnswers: {},
      results: {},
   };
   gameSessions.set(sessionId, gameSession);
   return sessionId;
}

function getNextCountry(sessionId) {
   const session = gameSessions.get(sessionId);
   if (!session) return null;

   let newIndex;
   do {
      newIndex = getRandomCountryIndex();
   } while (session.usedCountries.includes(newIndex));

   session.usedCountries.push(newIndex);
   session.currentCountryIndex = newIndex;
   return CountryData[newIndex];
}

// Socket.io connection handling
io.on("connection", (socket) => {
   let playerSessionId = null;

   socket.on("lookForOpponent", (playerInfo) => {
      const { name, mode } =
         typeof playerInfo === "object"
            ? playerInfo
            : { name: playerInfo, mode: "Flags" };

      const matchingOpponent = waitingPlayers.find(
         (player) => player.mode === mode
      );

      if (matchingOpponent) {
         waitingPlayers.splice(waitingPlayers.indexOf(matchingOpponent), 1);

         playerSessionId = createGameSession(
            socket.id,
            matchingOpponent.socketId,
            mode
         );

         const initialCountry =
            CountryData[gameSessions.get(playerSessionId).currentCountryIndex];

         io.to(socket.id).emit("gameStart", {
            opponent: matchingOpponent.name,
            country: initialCountry,
         });

         io.to(matchingOpponent.socketId).emit("gameStart", {
            opponent: name,
            country: initialCountry,
         });
      } else {
         waitingPlayers.push({
            socketId: socket.id,
            name: name,
            mode: mode,
         });
      }
   });

   // ... Add other socket event handlers from server.cjs ...

   socket.on("disconnect", () => {
      const index = waitingPlayers.findIndex(
         (player) => player.socketId === socket.id
      );
      if (index !== -1) {
         waitingPlayers.splice(index, 1);
      }

      if (playerSessionId) {
         const session = gameSessions.get(playerSessionId);
         if (session) {
            const otherPlayerId = session.players.find(
               (id) => id !== socket.id
            );
            if (otherPlayerId) {
               io.to(otherPlayerId).emit("opponentDisconnected");
            }
            gameSessions.delete(playerSessionId);
         }
      }
   });
});

// Export the server for Vercel
module.exports = server;
