import React, { useState } from "react";
import CountryData from "../CountryData.json";

export default function Capitals() {
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
         if (userInput.trim().toUpperCase() == CountryData[index].capital[0]) {
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
            <h1 className="text-5xl">Capitals</h1>
            <h1 className={(gameOver ? "hidden " : "block ") + "text-2xl"}>
               What is the capital of {CountryData[index].name[0]}?
            </h1>
            <h1>Score: {score}</h1>
            <h1>
               Question: {currentQuestion} / {question}
            </h1>
            <input
               placeholder="Enter the capital"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value)}
               className={(gameOver ? "hidden " : "block ") + "bg-transparent"}
            />
            <h1 className={showResponse ? "block" : "hidden"}>Correct</h1>
            <button
               className={gameOver ? "hidden" : "block"}
               onClick={checkUserAnswer}
            >
               Submit
            </button>
         </div>
      </>
   );
}
