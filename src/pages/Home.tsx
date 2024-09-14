import ModeCard from "./ModeCard";
import FlagsImg from "../assets/flags.jpg";
import CapitalsImg from "../assets/capitals.jpg";
import ShapesImg from "../assets/shapes.jpg";
import DomainsImg from "../assets/domains.jpg";
import WorldMap from "../assets/WorldMap";
import Banner from "../assets/banner.png";

import SupportPopover from "./SupportPopover";

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
   return (
      <div className="flex flex-col items-center sm:mt-[1rem] lg:mt-[10%] justify-center mb-1">
         <img src={Banner} alt="GeoQuiz Logo" className="sm:w-72 w-[70%]" />
         <div className="flex flex-col md:flex-row gap-2 mb-2">
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
               img={ShapesImg}
               link="/shapes"
            ></ModeCard>
            <ModeCard
               title="Domains"
               description="Guess the top level domains of the world's countries."
               img={DomainsImg}
               link="/domains"
            ></ModeCard>
            <Popover>
               <PopoverTrigger className="fixed top-1 right-1 text-stone-200">
                  Credits
               </PopoverTrigger>
               <PopoverContent>
                  Photo by{" "}
                  <a href="https://unsplash.com/@joey_csunyo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Joey Csunyo
                  </a>{" "}
                  on{" "}
                  <a href="https://unsplash.com/photos/map-of-australia-2EGuIR00UTk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Unsplash
                  </a>
                  <br />
                  Photo by{" "}
                  <a href="https://unsplash.com/@lemonvlad?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Vladislav Klapin
                  </a>{" "}
                  on{" "}
                  <a href="https://unsplash.com/photos/assorted-flag-YeO44yVTl20?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Unsplash
                  </a>
                  <br />
                  Photo by{" "}
                  <a href="https://unsplash.com/@christianlue?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Christian Lue
                  </a>{" "}
                  on{" "}
                  <a href="https://unsplash.com/photos/white-red-and-green-map-7dEyTJ7-8os?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Unsplash
                  </a>
                  <br />
                  Photo by{" "}
                  <a href="https://unsplash.com/@nasa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     NASA
                  </a>{" "}
                  on{" "}
                  <a href="https://unsplash.com/photos/photo-of-outer-space-Q1p7bh3SHj8?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
                     Unsplash
                  </a>
                  <br />
                  World Map by{" "}
                  <a href="https://simplemaps.com/resources/svg-world">
                     Simple Maps
                  </a>
               </PopoverContent>
            </Popover>

            <SupportPopover></SupportPopover>
            <WorldMap />
         </div>
      </div>
   );
}
