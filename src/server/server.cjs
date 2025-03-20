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
      scores: { [player1Id]: 0, [player2Id]: 0 }, // Add score tracking
      currentCountryIndex: getRandomCountryIndex(),
      mode: mode || "Flags", // Default to Flags if not specified
      usedCountries: [],
      timerActive: false,
      answeredPlayers: new Set(), // Track which players have answered
      playerAnswers: {}, // Track player answers
      results: {}, // Add results storage
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

      // Check if there's already a player waiting with the same mode
      const matchingOpponent = waitingPlayers.find(
         (player) => player.mode === mode
      );

      if (matchingOpponent) {
         // Remove the matched opponent from waiting queue
         waitingPlayers.splice(waitingPlayers.indexOf(matchingOpponent), 1);

         // Create a game session for these two players
         const sessionId = createGameSession(
            socket.id,
            matchingOpponent.socketId,
            mode
         );

         // Store session ID for both players
         socket.data.sessionId = sessionId;
         const opponentSocket = io.sockets.sockets.get(
            matchingOpponent.socketId
         );
         if (opponentSocket) {
            opponentSocket.data.sessionId = sessionId;
         }

         // Get the first country for the game
         const country =
            CountryData[gameSessions.get(sessionId).currentCountryIndex];

         // Notify both players about the match and send initial question
         socket.emit("opponentFound", {
            name: matchingOpponent.name,
            country: country,
            mode: mode,
            sessionId: sessionId,
         });

         io.to(matchingOpponent.socketId).emit("opponentFound", {
            name: name,
            country: country,
            mode: mode,
            sessionId: sessionId,
         });

         console.log(
            `Matched ${name} with ${matchingOpponent.name} in ${mode} mode`
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
   socket.on("playerAnswered", (answer) => {
      const sessionId = socket.data.sessionId;
      if (!sessionId) return;

      const session = gameSessions.get(sessionId);
      if (!session || session.answeredPlayers.has(socket.id)) return;

      handlePlayerAnswer(sessionId, socket.id, answer);
   });

   // Add new function to handle answers (both manual and auto)
   function handlePlayerAnswer(sessionId, playerId, answer) {
      const session = gameSessions.get(sessionId);
      if (!session || session.answeredPlayers.has(playerId)) return;

      // Store the player's answer and mark as answered
      session.playerAnswers[playerId] = answer;
      session.answeredPlayers.add(playerId);

      // If this is the first player to answer, start the timer
      if (session.answeredPlayers.size === 1) {
         session.timerActive = true;
         session.players.forEach((pid) => {
            io.to(pid).emit("timerStarted");
         });

         // Set timer for 5 seconds
         session.timer = setTimeout(() => {
            // Force submit any remaining players
            session.players.forEach((pid) => {
               if (!session.answeredPlayers.has(pid)) {
                  const playerSocket = io.sockets.sockets.get(pid);
                  if (playerSocket?.data.currentInput) {
                     handlePlayerAnswer(
                        sessionId,
                        pid,
                        playerSocket.data.currentInput
                     );
                  } else {
                     handlePlayerAnswer(sessionId, pid, "");
                  }
               }
            });
            evaluateAnswersAndProceed(sessionId);
         }, 5000);
      }

      // If both players have answered, evaluate immediately
      if (session.answeredPlayers.size === 2) {
         if (session.timer) {
            clearTimeout(session.timer);
         }
         evaluateAnswersAndProceed(sessionId);
      }
   }

   socket.on("autoSubmitAnswer", (answer) => {
      const sessionId = socket.data.sessionId;
      if (!sessionId) return;

      handlePlayerAnswer(sessionId, socket.id, answer);
   });

   function evaluateAnswersAndProceed(sessionId) {
      const session = gameSessions.get(sessionId);
      if (!session || session.evaluating) return; // Add guard against multiple evaluations

      session.evaluating = true; // Mark as evaluating
      const currentCountry = CountryData[session.currentCountryIndex];
      const results = {};

      // Evaluate each player's answer
      session.players.forEach((playerId) => {
         const playerAnswer = session.playerAnswers[playerId] || "";
         const isCorrect = currentCountry.name.includes(
            playerAnswer.trim().toUpperCase()
         );

         results[playerId] = {
            isCorrect,
            answer: playerAnswer,
         };

         // Only increment score if not already counted
         if (isCorrect && !session.scoresCounted) {
            session.scores[playerId]++;
         }
      });

      session.scoresCounted = true; // Mark scores as counted

      // Send results to all players
      session.players.forEach((playerId) => {
         io.to(playerId).emit("roundComplete", {
            results,
            scores: session.scores,
            correctAnswer: currentCountry.name[0],
         });
      });

      // Move to next question after longer delay to show feedback
      setTimeout(() => {
         moveToNextQuestion(sessionId);
      }, 3500); // Increased delay to 3.5 seconds
   }

   function moveToNextQuestion(sessionId) {
      const session = gameSessions.get(sessionId);
      if (!session) return;

      session.timerActive = false;
      session.answeredPlayers.clear();
      session.playerAnswers = {};
      session.results = {};
      session.evaluating = false; // Reset evaluating flag
      session.scoresCounted = false; // Reset scores counted flag

      const nextCountry = getNextCountry(sessionId);
      if (nextCountry) {
         const nextQuestionData = {
            country: nextCountry,
            mode: session.mode,
         };

         // Send to all players simultaneously
         session.players.forEach((playerId) => {
            io.to(playerId).emit("newQuestion", nextQuestionData);
         });
      }
   }

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

   socket.on("inputChange", (currentInput) => {
      socket.data.currentInput = currentInput;
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
