import React, { useState } from "react";
import CountryData from "../CountryData.json";

export default function Capitals() {
   const [index, setIndex] = useState(0);
   const [userInput, setUserInput] = useState("");

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   function checkUserAnswer() {
      if (userInput.trim().toUpperCase() == CountryData[index].capital) {
         console.log("Right");
      }
   }

   return (
      <>
         <h1 className="text-5xl">Capitals</h1>
         <h1>{CountryData[index].name}</h1>
         <input
            placeholder="Enter the capital"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
         />
         <button className="block" onClick={checkUserAnswer}>
            Submit
         </button>
         <button onClick={getRandomCountry}>Get Random Country</button>
      </>
   );
}
