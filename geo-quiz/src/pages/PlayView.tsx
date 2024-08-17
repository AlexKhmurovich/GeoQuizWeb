import React, { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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
   const [question, setQuestion] = useState(5);
   const [gameOver, setGameOver] = useState(false);

   const [usedIndexes, setUsedIndexes] = useState<number[]>([]);

   function getRandomCountry() {
      do {
         setIndex(Math.floor(Math.random() * CountryData.length));
      } while (usedIndexes.includes(index));

      setUsedIndexes([...usedIndexes, index]);
   }

   function checkUserAnswer() {
      if (
         userInput.trim().toUpperCase() ==
         (props.mode == "Flags"
            ? CountryData[index].name[0]
            : CountryData[index].capital[0])
      ) {
         console.log("Right");
         setScore((score += 1));
         setIsCorrect(true);
      } else {
         setIsWrong(true);
      }

      setTimeout(() => {
         console.log("");
      }, 1000);

      if (currentQuestion == question || gameOver) {
         setGameOver(true);
         return;
      }

      setIsCorrect(false);
      setIsWrong(false);
      setCurrentQuestion((currentQuestion += 1));
      setUserInput("");
      getRandomCountry();
   }

   return (
      <div className="flex items-center justify-center h-full ">
         <div className={"flex flex-col items-center w-full h-full "}>
            <div className="flex justify-around items-center w-full">
               <a href="/" className="flex-1 flex items-start">
                  <Button variant={"link"}>
                     <ChevronLeft />
                     Home
                  </Button>
               </a>
               <h1 className="text-2xl font-bold m-2">{props.mode}</h1>
               <div className="w-6 flex-1"></div>
            </div>
            <Separator className="mb-4" />

            <div
               className={
                  "w-fit border-[1px] rounded-lg p-2 " +
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
               <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSettingsSet(true)}
               >
                  Done
               </Button>
            </div>

            <div
               className={
                  "flex flex-col items-center w-full h-full mt-32 " +
                  (setttingsSet ? "block" : "hidden")
               }
            >
               <h1
                  className={
                     (gameOver ? "hidden " : "block ") +
                     "text-xl text-gray-500 mb-2"
                  }
               >
                  {props.questionString}
               </h1>
               {props.mode == "Flags" ? (
                  <img
                     src={CountryData[index]["onlineFlag"]}
                     alt="Flag"
                     className={
                        (gameOver ? "hidden " : "block ") +
                        "rounded-lg w-72 border-black shadow-lg"
                     }
                  />
               ) : (
                  <h1
                     className={
                        (gameOver ? "hidden " : "block ") +
                        "text-2xl font-semibold"
                     }
                  >
                     {titleize(CountryData[index].name[0])}
                  </h1>
               )}

               <div className="w-96 mt-4 mb-2">
                  <div className="flex flex-col items-start w-full">
                     <h1>
                        <b>Score:</b> {score}
                     </h1>
                     <h1>
                        <b>Question:</b> {currentQuestion} / {question}
                     </h1>
                     <a
                        href={props.mode}
                        className={!gameOver ? "hidden " : "block "}
                     >
                        <Button>Restart</Button>
                     </a>
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
                             (props.mode == "Flags"
                                ? CountryData[index].name[0]
                                : titleize(CountryData[index].capital[0]))
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
                        (gameOver ? "hidden " : "block ") +
                        "bg-transparent mt-2"
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
      </div>
   );
}
