import React, { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PlayView(props: any) {
   const [index, setIndex] = useState(
      Math.floor(Math.random() * CountryData.length)
   );
   const [userInput, setUserInput] = useState("");
   const [isCorrect, setIsCorrect] = useState(false);
   const [isWrong, setIsWrong] = useState(false);

   let [score, setScore] = useState(0);
   let [currentQuestion, setCurrentQuestion] = useState(1);
   const [question, setQuestion] = useState(5);
   const [gameOver, setGameOver] = useState(false);

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
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
      <>
         <div>
            <h1>Number of Questions:</h1>
            <input
               type="number"
               defaultValue={question}
               value={question}
               onChange={(e) => setQuestion(Number(e.currentTarget.value))}
            />
         </div>
         <div className="flex flex-col items-center w-full">
            <h1 className="text-4xl font-bold mb-10">{props.mode}</h1>
            <h1 className={(gameOver ? "hidden " : "block ") + "text-2xl"}>
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
               <h1>{CountryData[index].name[0]}</h1>
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
                     {isCorrect ? "Correct" : isWrong ? "Wrong" : ""}
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
      </>
   );
}
