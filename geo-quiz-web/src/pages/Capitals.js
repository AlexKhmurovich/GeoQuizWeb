import React, { useState } from "react";
import CountryData from "../CountryData.json";

export default function Capitals() {
   const [index, setIndex] = useState(0);

   function getRandomCountry() {
      setIndex(Math.floor(Math.random() * CountryData.length));
   }

   return (
      <>
         <h1>{CountryData[index].name}</h1>
         <button onClick={getRandomCountry}>Get Random Country</button>
      </>
   );
}
