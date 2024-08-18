import { useState } from "react";
import CountryData from "../CountryData.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import WorldMap from "@/assets/WorldMap";

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

   const [penalizeMistakes, setPenalizeMistakes] = useState(false);

   const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

   function getRandomCountry() {
      setUsedIndexes([...usedIndexes, index]);
      do {
         setIndex(Math.floor(Math.random() * CountryData.length));
      } while (usedIndexes.includes(index));
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
                     "rounded-lg w-72 shadow-lg"
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
                     "rounded-lg w-72 border-black"
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
         (props.mode === ("Flags" || "Shapes") &&
            CountryData[index].name.includes(userInput.trim().toUpperCase())) ||
         (props.mode !== "Capitals" &&
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
                  "w-fit border-[1px] rounded-lg p-4 px-12 mt-32 bg-white " +
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
               {renderQuestion(props.mode)}
               <div className="w-96 mt-4 mb-2">
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

                     <Card
                        className={
                           !gameOver
                              ? "hidden "
                              : "flex flex-col " + " justify-center"
                        }
                     >
                        <CardHeader>
                           <CardTitle>Game Over</CardTitle>
                           <CardDescription>
                              Here's how you did.
                           </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <h1>
                              <b>Your final score is: </b> {score}
                           </h1>
                           <h1>
                              <b>You've completed:</b> {currentQuestion} Q
                           </h1>
                        </CardContent>
                        <CardFooter className="justify-center">
                           <a href={props.mode}>
                              <Button>Restart</Button>
                           </a>
                        </CardFooter>
                     </Card>
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
         <WorldMap />
      </div>
   );
}
