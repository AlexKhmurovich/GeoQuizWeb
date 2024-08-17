import ModeCard from "./ModeCard";
import FlagsImg from "../assets/flags.jpg";
import CapitalsImg from "../assets/capitals.jpg";

export default function Home() {
   return (
      <div className="App">
         <h1 className="text-2xl font-bold mb-2">Welcome to GeoQuiz</h1>
         <div className="flex flex-row gap-2">
            <ModeCard
               title="Flags"
               description="Guess the flags of the world's countries."
               img={FlagsImg}
               link="/flags"
            ></ModeCard>
            <ModeCard
               title="Capitals"
               description="Guess the capitals of the world's countries."
               img={CapitalsImg}
               link="/capitals"
            ></ModeCard>
         </div>
      </div>
   );
}
