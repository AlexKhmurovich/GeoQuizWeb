import { useState, useEffect, useRef } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { Trophy, RotateCcw, Loader2 } from "lucide-react";

import { Settings, Play, AlertCircle, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { AnimatedCounter } from "react-animated-counter";

import WorldMap from "@/assets/WorldMap";

import SupportPopover from "./SupportPopover";

import Header from "@/components/Header";

import titleize from "titleize";
import { io } from "socket.io-client";

export default function PlayView(props: any) {
   const [index, setIndex] = useState(
      Math.floor(Math.random() * CountryData.length)
   );
   // Add a state to track used countries
   const [usedCountries, setUsedCountries] = useState<number[]>([]);
   const [userInput, setUserInput] = useState("");
   const [isCorrect, setIsCorrect] = useState(false);
   const [isWrong, setIsWrong] = useState(false);

   const [modeQType, setModeQType] = useState(props.mode);
   const [modeAType, setModeAType] = useState(props.mode);

   const [setttingsSet, setSettingsSet] = useState(false);

   let [score, setScore] = useState(0);
   let [currentQuestion, setCurrentQuestion] = useState(1);
   const [question, setQuestion] = useState<number | "">(5);
   const [gameOver, setGameOver] = useState(false);
   const [blinkTimer, setBlinkTimer] = useState(1);
   const [blinkMode, setBlinkMode] = useState(false);

   const [questionString, setQuestionString] = useState("");

   const [amountCorrect, setAmountCorrect] = useState(0);

   const [penalizeMistakes, setPenalizeMistakes] = useState(false);

   // New states for multiplayer
   const [waitingForOpponent, setWaitingForOpponent] = useState(false);
   const [opponentName, setOpponentName] = useState("");
   const [socket, setSocket] = useState<any>(null);
   const [playerName, setPlayerName] = useState("");

   const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

   const audioRef = useRef<HTMLAudioElement>(null);

   useEffect(() => {
      if (gameOver && audioRef.current) {
         audioRef.current.pause();
         audioRef.current.currentTime = 0; // Reset the audio to the beginning
      }
   }, [gameOver]);

   // Socket connection setup
   useEffect(() => {
      if (props.isMulti && !socket) {
         // Connect to the socket server
         const newSocket = io("http://localhost:3000");
         setSocket(newSocket);

         // Socket event listeners
         newSocket.on("waiting", () => {
            setWaitingForOpponent(true);
         });

         newSocket.on("opponentFound", (name) => {
            setWaitingForOpponent(false);
            setOpponentName(name);
         });

         // Cleanup on unmount
         return () => {
            newSocket.disconnect();
         };
      }
   }, [props.isMulti]);

   // Replace the old getRandomCountry function with this improved version
   function getRandomCountry() {
      // If all countries have been used, reset the used countries array
      if (usedCountries.length >= CountryData.length - 1) {
         setUsedCountries([index]); // Keep current index to avoid immediate repeat

         // Get a random country that isn't the current one
         let newIndex;
         do {
            newIndex = Math.floor(Math.random() * CountryData.length);
         } while (newIndex === index);

         setIndex(newIndex);
         return;
      }

      // Otherwise, find a country that hasn't been used yet
      let newIndex;
      do {
         newIndex = Math.floor(Math.random() * CountryData.length);
      } while (usedCountries.includes(newIndex) || newIndex === index);

      setIndex(newIndex);
      setUsedCountries([...usedCountries, newIndex]);
   }

   function renderQuestion(modeQ: string) {
      switch (modeQ) {
         case "Flags":
            return (
               <div>
                  <img
                     src={CountryData[index]["onlineFlag"]}
                     alt="Flag"
                     className={
                        (gameOver ? "hidden " : "block ") +
                        "rounded-lg w-full max-w-xs max-h-xs shadow-lg " +
                        (blinkMode ? "animate-blink" : "")
                     }
                     key={index}
                  />
                  <style>{`
               @keyframes blink {
                 0% { opacity: 1; }
                 99% { opacity: 1; }
                 100% { opacity: 0; }
               }
               .animate-blink {
                 animation: blink ${blinkTimer}s forwards;
               }
            `}</style>
               </div>
            );
         case "Shapes":
            return (
               <div>
                  <img
                     src={CountryData[index]["onlineShape"]}
                     alt="Shape"
                     className={
                        (gameOver ? "hidden " : "block ") +
                        "rounded-lg w-full max-w-xs max-h-xs " +
                        (blinkMode ? "animate-blink" : "")
                     }
                     key={index}
                  />
                  <style>{`
               @keyframes blink {
                0% { opacity: 1; }
                99% { opacity: 1; }
                100% { opacity: 0; }
               }
               .animate-blink {
                animation: blink ${blinkTimer}s forwards;
               }
            `}</style>
               </div>
            );
         case "Capitals":
            return (
               <h1
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "text-2xl font-semibold"
                  }
               >
                  {titleize(CountryData[index].name[0])}
               </h1>
            );
         case "Domains":
            return (
               <h1
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "text-2xl font-semibold"
                  }
               >
                  {titleize(CountryData[index].name[0])}
               </h1>
            );
         case "Anthems":
            return (
               <audio
                  ref={audioRef}
                  controls
                  autoPlay={setttingsSet ? true : false}
                  src={CountryData[index].onlineAnthem}
                  className={gameOver ? "hidden " : "block "}
               ></audio>
            );
         default:
            return (
               <h1
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "text-2xl font-semibold"
                  }
               >
                  {titleize(CountryData[index].name[0])}
               </h1>
            );
      }
   }

   function renderCorrectAnswer(modeA: string) {
      switch (modeA) {
         case "Flags":
            return titleize(CountryData[index].name[0]);
         case "Shapes":
            return titleize(CountryData[index].name[0]);
         case "Countries":
            return titleize(CountryData[index].name[0]);
         case "Capitals":
            return titleize(CountryData[index].capital[0]);
         case "Domains":
            return titleize("." + CountryData[index].domain.toLowerCase());
         case "Anthems":
            return titleize(CountryData[index].name[0]);
         default:
            return "foo";
      }
   }

   async function checkUserAnswer() {
      if (
         ((modeAType == "Flags" ||
            modeAType == "Shapes" ||
            modeAType == "Anthems" ||
            modeAType == "Countries") &&
            CountryData[index].name.includes(userInput.trim().toUpperCase())) ||
         (modeAType == "Capitals" &&
            CountryData[index].capital.includes(
               userInput.trim().toUpperCase()
            )) ||
         (modeAType == "Domains" &&
            CountryData[index].domain ==
               userInput.trim().replace(".", "").toLowerCase())
      ) {
         console.log("Right");
         setScore((score += 1));
         setAmountCorrect(amountCorrect + 1);
         setIsCorrect(true);
      } else {
         if (penalizeMistakes) {
            setScore((score -= 1));
         }
         setIsWrong(true);
      }

      await delay(1000);

      if (currentQuestion == question || gameOver) {
         setIsCorrect(false);
         setIsWrong(false);
         setGameOver(true);
         setUsedCountries([]);
         return;
      }

      setIsCorrect(false);
      setIsWrong(false);
      setCurrentQuestion((currentQuestion += 1));
      setUserInput("");
      getRandomCountry();
   }

   const [showWarning, setShowWarning] = useState(false);

   const handleStart = () => {
      if (props.isMulti) {
         if (userInput.trim() === "") {
            setShowWarning(true);
            return;
         }
         setPlayerName(userInput);
         // Start looking for an opponent
         if (socket) {
            socket.emit("lookForOpponent", userInput);
         }
         setSettingsSet(true);
         return;
      }

      if (
         question === "" ||
         question < 1 ||
         modeQType == "Combo" ||
         modeAType == "Combo" ||
         ((modeQType == "Combo" || modeAType == "Combo") &&
            modeQType == modeAType)
      ) {
         setShowWarning(true);
         return;
      }

      switch (modeAType) {
         case "Capitals":
            setQuestionString("Name the capital of:");
            break;
         case "Anthems":
            setQuestionString("Name the country with this anthem:");
            break;
         case "Flags":
            setQuestionString("Name this flag:");
            break;
         case "Shapes":
            setQuestionString("Name this shape:");
            break;
         case "Domains":
            setQuestionString("Name the domain of:");
            break;
         default:
            setQuestionString("Name this country:");
      }
      setShowWarning(false);
      if (!showWarning) {
         setUsedCountries([index]); // Initialize with current index
         setSettingsSet(true);
      }
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value === "" ? "" : parseInt(e.target.value);
      setQuestion(value);
      if (value !== "" && value >= 1) {
         setShowWarning(false);
      }
   };

   return (
      <div className="flex items-center justify-center h-full p-4 sm:p-8 ">
         <div className="flex flex-col items-center w-full h-full">
            <Header mode={props.mode} isMulti={props.isMulti} />
            {props.isMulti && (
               <div
                  className={
                     "bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 w-full max-w-sm mx-auto " +
                     (!setttingsSet ? "flex flex-col" : "hidden")
                  }
               >
                  <div className="flex items-center space-x-2 text-gray-800 mb-4">
                     <Settings className="w-5 h-5" aria-hidden="true" />
                     <h2 className="text-xl font-bold">Quiz Settings</h2>
                  </div>

                  <div className="space-y-4">
                     <div className="text-left">
                        <Label
                           htmlFor="userName"
                           className="text-gray-700 text-left"
                        >
                           Enter your name
                        </Label>
                        <Input
                           id="userName"
                           type="text"
                           value={userInput}
                           onChange={(e) => setUserInput(e.target.value)}
                           className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 mt-1"
                           aria-describedby="userNameError"
                        />
                     </div>
                  </div>

                  <div className="mt-4" aria-live="polite">
                     {showWarning && (
                        <Alert
                           variant="destructive"
                           className="mb-4 py-2 text-sm"
                           id="userNameError"
                        >
                           <AlertCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                           />
                           <AlertDescription>
                              Please enter your name
                           </AlertDescription>
                        </Alert>
                     )}

                     <Button
                        onClick={() => {
                           if (userInput.trim() === "") {
                              setShowWarning(true);
                              return;
                           }
                           setShowWarning(false);
                           handleStart();
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full transition-all duration-200 ease-in-out flex items-center justify-center h-12 hover:scale-[0.98] active:scale-[0.97]"
                     >
                        <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                        Look for Opponent
                     </Button>
                  </div>
               </div>
            )}

            {/* Multiplayer Waiting Screen */}
            {props.isMulti && setttingsSet && (
               <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 w-full max-w-sm mx-auto">
                  {waitingForOpponent ? (
                     <div className="flex flex-col items-center justify-center p-4">
                        <Loader2 className="h-8 w-8 animate-spin text-green-500 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                           Waiting for opponent to join
                        </h2>
                        <p className="text-gray-600">This won't take long...</p>
                     </div>
                  ) : opponentName ? (
                     <div className="flex flex-col items-center justify-center p-4">
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 w-full">
                           <h2 className="text-xl font-bold text-center">
                              You are matched with{" "}
                              <span className="font-extrabold">
                                 {opponentName}
                              </span>
                           </h2>
                        </div>
                        <div className="flex w-full justify-between mt-4">
                           <div className="text-center p-2 bg-blue-100 rounded-lg flex-1 mr-2">
                              <p className="font-bold">{playerName}</p>
                              <p>You</p>
                           </div>
                           <div className="text-center p-2 bg-orange-100 rounded-lg flex-1 ml-2">
                              <p className="font-bold">{opponentName}</p>
                              <p>Opponent</p>
                           </div>
                        </div>
                     </div>
                  ) : null}
               </div>
            )}

            {!props.isMulti && (
               <div
                  className={
                     "bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 w-full max-w-sm mx-auto " +
                     (!setttingsSet ? "flex flex-col" : "hidden")
                  }
               >
                  <div className="flex items-center space-x-2 text-gray-800 mb-4">
                     <Settings className="w-5 h-5" aria-hidden="true" />
                     <h2 className="text-xl font-bold">Quiz Settings</h2>
                  </div>

                  <div className="space-y-4">
                     {props.mode == "Combo" ? (
                        <div className="text-left">
                           <div className="flex w-100 space-x-4">
                              <div className="flex-1">
                                 <Label
                                    htmlFor="questionType"
                                    className="text-gray-700 text-left"
                                 >
                                    Question Type
                                 </Label>
                                 <Select
                                    onValueChange={(value: string) => {
                                       setModeQType(value);
                                    }}
                                 >
                                    <SelectTrigger id="questionType">
                                       <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Flags">
                                          Flag
                                       </SelectItem>
                                       <SelectItem value="Shapes">
                                          Shape
                                       </SelectItem>
                                       <SelectItem value="Anthems">
                                          Anthem
                                       </SelectItem>
                                       <SelectItem value="Countries">
                                          Country
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>

                              <div className="flex-1">
                                 <Label
                                    htmlFor="answerType"
                                    className="text-gray-700 text-left"
                                 >
                                    Answer Type
                                 </Label>
                                 <Select
                                    onValueChange={(value: string) => {
                                       setModeAType(value);
                                    }}
                                 >
                                    <SelectTrigger id="answerType">
                                       <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectItem value="Capitals">
                                          Capital
                                       </SelectItem>
                                       <SelectItem value="Domains">
                                          Domain
                                       </SelectItem>
                                       <SelectItem value="Countries">
                                          Country
                                       </SelectItem>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        </div>
                     ) : (
                        ""
                     )}
                     <div className="text-left">
                        <Label
                           htmlFor="numQuestions"
                           className="text-gray-700 text-left"
                        >
                           Number of Questions
                        </Label>
                        <Input
                           id="numQuestions"
                           type="number"
                           min="1"
                           value={question}
                           onChange={handleInputChange}
                           className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 mt-1"
                           aria-describedby="numQuestionsError"
                        />
                     </div>
                     <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                           <Switch
                              id="penalizeWrong"
                              checked={penalizeMistakes}
                              onCheckedChange={(checked) =>
                                 setPenalizeMistakes(checked)
                              }
                           />
                           <Label
                              htmlFor="penalizeWrong"
                              className="text-gray-700 ml-2"
                           >
                              -1 for mistakes
                           </Label>
                        </div>

                        {(props.mode == "Flags" ||
                           (props.mode == "Combo" &&
                              (modeQType == "Flags" ||
                                 modeQType == "Shapes")) ||
                           props.mode == "Shapes") && (
                           <div className="flex items-center">
                              <Switch
                                 id="blinkModeToggle"
                                 checked={blinkMode}
                                 onCheckedChange={(checked) =>
                                    setBlinkMode(checked)
                                 }
                              />
                              <Label
                                 htmlFor="blinkModeToggle"
                                 className="text-gray-700 ml-2"
                              >
                                 Blink Mode
                              </Label>
                           </div>
                        )}

                        {blinkMode && (
                           <div className="text-left">
                              <Label
                                 htmlFor="blinkTimer"
                                 className="text-gray-700 text-left"
                              >
                                 Blink Timer (s)
                              </Label>
                              <Input
                                 id="blinkTimer"
                                 type="number"
                                 min="1"
                                 value={blinkTimer}
                                 onChange={(e) =>
                                    setBlinkTimer(parseFloat(e.target.value))
                                 }
                                 className="bg-white border-gray-300 text-gray-800 placeholder-gray-400 mt-1"
                              />
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="mt-4" aria-live="polite">
                     {showWarning && (
                        <Alert
                           variant="destructive"
                           className="mb-4 py-2 text-sm"
                           id="numQuestionsError"
                        >
                           <AlertCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                           />
                           <AlertDescription>
                              Please enter a valid number of questions (minimum
                              1){" "}
                              {props.mode == "Combo"
                                 ? "and/or Please select different question and answer types"
                                 : ""}
                           </AlertDescription>
                        </Alert>
                     )}

                     <Button
                        onClick={handleStart}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full transition-all duration-200 ease-in-out flex items-center justify-center h-12 hover:scale-[0.98] active:scale-[0.97]"
                     >
                        <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                        Start Quiz
                     </Button>
                  </div>
               </div>
            )}

            {/* Game */}
            <div
               className={
                  "bg-gradient-to-br from-white to-gray-100 rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 w-full max-w-sm mx-auto " +
                  (!gameOver ? "hidden " : "flex flex-col " + " justify-center")
               }
            >
               <div className="flex items-center space-x-2 text-gray-800 mb-4">
                  <Trophy className="w-5 h-5" aria-hidden="true" />
                  <h2 className="text-xl font-bold">Quiz Results</h2>
               </div>

               <div className="space-y-4 text-center">
                  <div className="text-4xl font-bold text-gray-800">
                     {score} / {question}
                  </div>
                  <div className="text-gray-600">
                     {Math.round((amountCorrect / Number(question)) * 100)}%
                     accuracy
                  </div>
               </div>

               <div className="mt-8">
                  <a href={props.mode}>
                     <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-full transition-all duration-200 ease-in-out flex items-center justify-center h-12 hover:scale-[0.98] active:scale-[0.97]">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart Quiz
                     </Button>
                  </a>
               </div>
            </div>

            <div
               className={
                  "flex flex-col items-center w-full h-full mt-4 sm:mt-8 " +
                  (setttingsSet ? "block" : "hidden")
               }
            >
               <h1
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "text-lg sm:text-xl text-gray-500 mb-2"
                  }
               >
                  {questionString}
               </h1>
               {setttingsSet ? renderQuestion(modeQType) : ""}
               <div className="w-full max-w-md mt-4 mb-2">
                  <div
                     className={
                        "flex flex-col w-full justify-between " +
                        (gameOver ? "" : " ")
                     }
                  >
                     <div
                        className={
                           "flex items-center justify-between " +
                           (gameOver ? "hidden " : " ")
                        }
                     >
                        <h1 className="flex items-center text-left justify-start border border-gray-200 bg-white rounded-full px-2 py-1">
                           <b className="mr-1">Score: </b>
                           <AnimatedCounter
                              value={score}
                              decimalPrecision={0}
                              fontSize="16px"
                              digitStyles={{ textAlign: "left" }}
                           />
                        </h1>
                        <h1 className="border border-gray-200 bg-white rounded-full text-center px-2 py-1">
                           <b>Question:</b> {currentQuestion} / {question}
                        </h1>
                     </div>

                     {isWrong && (
                        <Alert variant="destructive" className="text-left mt-2">
                           <AlertCircle
                              className="h-4 w-4"
                              aria-hidden="true"
                           />
                           <AlertTitle>Wrong</AlertTitle>
                           <AlertDescription>
                              The correct answer is{" "}
                              {renderCorrectAnswer(modeAType)}
                           </AlertDescription>
                        </Alert>
                     )}

                     {isCorrect && (
                        <Alert
                           variant="default"
                           className="text-green-500 text-left mt-2"
                        >
                           <BadgeCheck
                              className="h-4 w-4 "
                              aria-hidden="true"
                              color="rgb(34 197 94)"
                           />
                           <AlertTitle>Correct</AlertTitle>
                           <AlertDescription>Good Job!</AlertDescription>
                        </Alert>
                     )}
                  </div>
                  <Input
                     placeholder="Enter the answer"
                     value={userInput}
                     onChange={(e) => setUserInput(e.target.value)}
                     onKeyDown={(event) => {
                        if (!isCorrect && !isWrong) {
                           if (event.key === "Enter") {
                              checkUserAnswer();
                           }
                        }
                     }}
                     onSubmit={checkUserAnswer}
                     className={
                        (gameOver ? "hidden " : "block ") + "bg-white mt-2"
                     }
                  />
               </div>
               <Button
                  className={gameOver ? "hidden" : "block"}
                  onClick={() => {
                     checkUserAnswer();
                  }}
               >
                  Submit
               </Button>
            </div>
         </div>
         <SupportPopover></SupportPopover>
         <WorldMap />
      </div>
   );
}
