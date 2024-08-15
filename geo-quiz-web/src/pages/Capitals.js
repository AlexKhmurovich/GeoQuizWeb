import React, { useState } from "react";
import CountryData from "../CountryData.json";

export default function Capitals() {
   const [index, setIndex] = useState(
      Math.floor(Math.random() * CountryData.length)
   );
   const [userInput, setUserInput] = useState("");
   const [showResponse, setShowResponse] = useState(false);

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   function checkUserAnswer() {
      if (userInput.trim().toUpperCase() == CountryData[index].capital) {
         console.log("Right");
         setShowResponse(true);
      }

      setTimeout(() => {
         setShowResponse(false);
         setUserInput("");
         getRandomCountry();
      }, 1000);
   }

   return (
      <>
         <h1 className="text-5xl">Capitals</h1>
         <h1>{CountryData[index].name[0]}</h1>
         <input
            placeholder="Enter the capital"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
         />
         <h1 className={showResponse ? "block" : "hidden"}>Correct</h1>
         <button className="block" onClick={checkUserAnswer}>
            Submit
         </button>
      </>
   );
}
