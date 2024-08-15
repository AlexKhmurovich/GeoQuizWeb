import React, { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Flags() {
   const [index, setIndex] = useState(
      Math.floor(Math.random() * CountryData.length)
   );
   const [userInput, setUserInput] = useState("");
   const [showResponse, setShowResponse] = useState(false);

   let [score, setScore] = useState(0);
   let [currentQuestion, setCurrentQuestion] = useState(1);
   const [question, setQuestion] = useState(5);
   const [gameOver, setGameOver] = useState(false);

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   function checkUserAnswer() {
      if (currentQuestion < question && !gameOver) {
         if (userInput.trim().toUpperCase() == CountryData[index].name[0]) {
            console.log("Right");
            setScore((score += 1));
            setShowResponse(true);
         }
      } else {
         setGameOver(true);
         return;
      }
      setTimeout(() => {
         setShowResponse(false);
         setCurrentQuestion((currentQuestion += 1));
         setUserInput("");
         getRandomCountry();
      }, 1000);
   }

   return (
      <>
         <div>
            <h1>Number of Questions</h1>
            <input
               type="number"
               defaultValue={question}
               value={question}
               onChange={(e) => setQuestion(Number(e.currentTarget.value))}
            />
         </div>
         <div className="flex flex-col items-center w-full">
            <h1 className="text-5xl">Flags</h1>
            <h1 className={(gameOver ? "hidden " : "block ") + "text-2xl"}>
               What flag is this?
            </h1>
            <img
               src={CountryData[index]["onlineFlag"]}
               alt="Flag"
               className={
                  (gameOver ? "hidden " : "block ") +
                  "rounded-lg w-60 border-black shadow-lg"
               }
            />
            <h1>Score: {score}</h1>
            <h1>
               Question: {currentQuestion} / {question}
            </h1>
            <Input
               placeholder="Enter the country"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               className={
                  (gameOver ? "hidden " : "block ") + "bg-transparent my-2"
               }
            />
            <h1 className={showResponse ? "block" : "hidden"}>Correct</h1>
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
