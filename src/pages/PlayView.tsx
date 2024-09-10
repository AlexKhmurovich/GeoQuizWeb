import { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trophy, RotateCcw } from "lucide-react";

import { Settings, Play, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import WorldMap from "@/assets/WorldMap";

import SupportPopover from "./SupportPopover";

import { ChevronLeft } from "lucide-react";

import titleize from "titleize";

export default function PlayView(props: any) {
   const [index, setIndex] = useState(
      Math.floor(Math.random() * CountryData.length)
   );
   const [userInput, setUserInput] = useState("");
   const [isCorrect, setIsCorrect] = useState(false);
   const [isWrong, setIsWrong] = useState(false);

   const [setttingsSet, setSettingsSet] = useState(false);

   let [score, setScore] = useState(0);
   let [currentQuestion, setCurrentQuestion] = useState(1);
   const [question, setQuestion] = useState<number | "">(5);
   const [gameOver, setGameOver] = useState(false);

   const [penalizeMistakes, setPenalizeMistakes] = useState(false);

   const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   function renderQuestion(mode: string) {
      switch (mode) {
         case "Flags":
            return (
               <img
                  src={CountryData[index]["onlineFlag"]}
                  alt="Flag"
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "rounded-lg w-full max-w-xs shadow-lg"
                  }
               />
            );
         case "Shapes":
            return (
               <img
                  src={CountryData[index]["onlineShape"]}
                  alt="Shape"
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "rounded-lg w-full max-w-xs border-black"
                  }
               />
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
         default:
            return "foo";
      }
   }

   function renderCorrectAnswer(mode: string) {
      switch (mode) {
         case "Flags":
            return titleize(CountryData[index].name[0]);
         case "Shapes":
            return titleize(CountryData[index].name[0]);

         case "Capitals":
            return titleize(CountryData[index].capital[0]);

         default:
            return "foo";
      }
   }

   async function checkUserAnswer() {
      if (
         ((props.mode == "Flags" || props.mode == "Shapes") &&
            CountryData[index].name.includes(userInput.trim().toUpperCase())) ||
         (props.mode == "Capitals" &&
            CountryData[index].capital.includes(userInput.trim().toUpperCase()))
      ) {
         console.log("Right");
         setScore((score += 1));
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
      if (question === "" || question < 1) {
         setShowWarning(true);
         return;
      }
      setShowWarning(false);
      setSettingsSet(true);
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
            <div className="flex justify-between items-center w-full">
               <a href="/" className="flex-1 flex items-start">
                  <Button variant={"link"}>
                     <ChevronLeft />
                     Home
                  </Button>
               </a>
               <h1 className="text-xl sm:text-2xl font-bold m-2">
                  {props.mode}
               </h1>
               <div className="w-6 flex-1"></div>
            </div>
            <Separator className="mb-4" />

            {/* <div
               className={
                  "w-full max-w-md border-[1px] rounded-lg p-4 sm:px-12 mt-4 sm:mt-8 bg-white " +
                  (!setttingsSet ? "flex flex-col" : "hidden")
               }
            >
               <h1 className="mb-2 font-bold">Settings</h1>
               <Separator />
               <h1 className="text-left mt-2">Number of Questions</h1>
               <Input
                  type="number"
                  min={1}
                  value={question}
                  onChange={(e) =>
                     setQuestion(
                        Number(e.currentTarget.value) > 1
                           ? Number(e.currentTarget.value)
                           : 1
                     )
                  }
               />
               <div className="flex items-center space-x-2 mt-2">
                  <Switch
                     id="penalizeMistakes"
                     checked={penalizeMistakes}
                     onCheckedChange={(checked) => setPenalizeMistakes(checked)}
                  />
                  <Label htmlFor="penalizeMistakes">-1 for mistakes</Label>
               </div>
               <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSettingsSet(true)}
               >
                  Start
               </Button>
            </div> */}

            {/* VO */}
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
               </div>

               <div className="mt-4" aria-live="polite">
                  {showWarning && (
                     <Alert
                        variant="destructive"
                        className="mb-4 py-2 text-sm"
                        id="numQuestionsError"
                     >
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        <AlertDescription>
                           Please enter a valid number of questions (minimum 1).
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

            {/* V0 */}
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
                     {Math.round((score / Number(question)) * 100)}% accuracy
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
                  {props.questionString}
               </h1>
               {renderQuestion(props.mode)}
               <div className="w-full max-w-md mt-4 mb-2">
                  <div
                     className={
                        "flex flex-col w-full" +
                        (gameOver ? "" : " items-start")
                     }
                  >
                     <div
                        className={
                           "text-left " + (gameOver ? "hidden " : "block ")
                        }
                     >
                        <h1>
                           <b>Score:</b> {score}
                        </h1>
                        <h1>
                           <b>Question:</b> {currentQuestion} / {question}
                        </h1>
                     </div>

                     <h1
                        className={
                           (isCorrect || isWrong ? "block " : "hidden ") +
                           (isCorrect
                              ? "text-green-600 font-bold"
                              : isWrong
                              ? "text-red-600 font-bold"
                              : "")
                        }
                     >
                        {isCorrect
                           ? "Correct"
                           : isWrong
                           ? "Wrong, the correct answer is " +
                             renderCorrectAnswer(props.mode)
                           : ""}
                     </h1>
                  </div>
                  <Input
                     placeholder="Enter the answer"
                     value={userInput}
                     onChange={(e) => setUserInput(e.target.value)}
                     onKeyDown={(event) => {
                        if (event.key === "Enter") {
                           checkUserAnswer();
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
                  onClick={checkUserAnswer}
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
