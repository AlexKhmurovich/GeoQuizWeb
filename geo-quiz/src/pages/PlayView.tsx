import React, { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   function capitalize(str: String) {
      return str[0].toUpperCase() + str.slice(1).toLowerCase();
   }

   function checkUserAnswer() {
      if (currentQuestion < question && !gameOver) {
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
      } else {
         setGameOver(true);
         return;
      }
      setTimeout(() => {
         setIsCorrect(false);
         setIsWrong(false);
         setCurrentQuestion((currentQuestion += 1));
         setUserInput("");
         getRandomCountry();
      }, 1000);
   }

   return (
      <div className="flex items-center justify-center">
         <div
            className={
               "w-fit border-[1px] rounded-lg p-2 " +
               (!setttingsSet ? "flex flex-col" : "hidden")
            }
         >
            <h1 className="mb-2">Settings</h1>
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
               "flex flex-col items-center w-full " +
               (setttingsSet ? "block" : "hidden")
            }
         >
            <h1 className="text-4xl font-bold mb-10">{props.mode}</h1>
            <h1
               className={
                  (gameOver ? "hidden " : "block ") +
                  "text-xl font-light text-gray-500"
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
               <h1 className="text-2xl font-semibold">
                  {capitalize(CountryData[index].name[0])}
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
                             : capitalize(CountryData[index].capital[0]))
                        : ""}
                  </h1>
               </div>
               <Input
                  placeholder="Enter the answer"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className={
                     (gameOver ? "hidden " : "block ") + "bg-transparent mt-2"
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
   );
}
