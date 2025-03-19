import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
   isMulti?: boolean;
   mode: string;
}

export default function Header({ isMulti, mode }: HeaderProps) {
   return (
      <>
         <div className="flex justify-between items-center w-full">
            <a href="/" className="flex-1 flex items-start">
               <Button variant={"link"}>
                  <ChevronLeft />
                  Home
               </Button>
            </a>
            {isMulti ? "Multiplayer" : "Singleplayer"}
            <h1 className="text-xl sm:text-2xl font-bold m-2">{mode}</h1>
            <div className="w-6 flex-1"></div>
         </div>
         <Separator className="mb-4" />
      </>
   );
}
