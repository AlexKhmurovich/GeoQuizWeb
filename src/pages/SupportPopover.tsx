import { Button } from "@/components/ui/button";

import { MessageCircleQuestion } from "lucide-react";

import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";

export default function SupportPopover() {
   return (
      <Popover>
         <PopoverTrigger className="fixed bottom-2 right-2 text-gray-200">
            <Button variant={"outline"} className="w-fit p-2 shadow-lg">
               <MessageCircleQuestion></MessageCircleQuestion>
            </Button>
         </PopoverTrigger>
         <PopoverContent>
            For any questions, concerns, or suggestions regarding the project
            please email:
            <a
               href="mailto:support@geoquiz.pro"
               className="underline decoration-solid"
            >
               {" "}
               support@geoquiz.pro
            </a>
         </PopoverContent>
      </Popover>
   );
}
