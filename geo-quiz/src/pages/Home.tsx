import ModeCard from "./ModeCard";

export default function Home() {
   return (
      <div className="App">
         <h1 className="font-bold">Welcome to GeoQuiz</h1>
         <div className="flex flex-row gap-2">
            <ModeCard
               title="Flags"
               description="Guess the flags of the world's countries."
               img="../assets/flags.jpg"
               link="/flags"
            ></ModeCard>
            <ModeCard
               title="Capitals"
               description="Guess the capitals of the world's countries."
               img="../assets/capitals.jpg"
               link="/capitals"
            ></ModeCard>
         </div>
      </div>
   );
}
