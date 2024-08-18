import ModeCard from "./ModeCard";
import FlagsImg from "../assets/flags.jpg";
import CapitalsImg from "../assets/capitals.jpg";
import WorldMap from "../assets/WorldMap";

export default function Home() {
   return (
      <div className="flex flex-col items-center">
         <h1 className="text-2xl font-bold mb-4">Welcome to GeoQuiz</h1>
         <div className="flex flex-col sm:flex-row gap-2">
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
            <ModeCard
               title="Shapes"
               description="Guess the shapes of the world's countries."
               img={CapitalsImg}
               link="/shapes"
            ></ModeCard>
            <WorldMap />
         </div>
      </div>
   );
}
