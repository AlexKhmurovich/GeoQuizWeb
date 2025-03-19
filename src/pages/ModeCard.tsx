import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { motion } from "framer-motion";

export default function ModeCard(props: any) {
   return (
      <motion.div
         whileHover={{ scale: 1.02 }}
         transition={{ type: "spring", stiffness: 200, damping: 15 }}
         className="flex-1"
      >
         <a href={props.link} className="block h-full">
            <Card className="flex flex-col items-center shadow-lg overflow-hidden relative h-80 cursor-pointer hover:shadow-xl transition-shadow">
               {/* Background image - blurred */}
               <div
                  className="absolute inset-0 w-full h-full z-0"
                  style={{
                     backgroundImage: `url(${props.img})`,
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                     filter: "blur(8px)",
                     transform: "scale(1.1)", // Prevents blur edges from showing
                  }}
               />

               {/* Overlay to improve text readability */}
               <div className="absolute inset-0 bg-white/70 dark:bg-black/60 z-10"></div>

               {/* Card content */}
               <div className="flex flex-col items-center justify-between w-full h-full z-20 relative py-6">
                  <CardHeader className="text-center pb-2">
                     <CardTitle className="text-2xl font-bold">
                        {props.title}
                     </CardTitle>
                     <CardDescription className="font-medium">
                        {props.description}
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow flex items-center justify-center py-2">
                     <img
                        src={props.img}
                        className="w-60 h-32 rounded-lg shadow-md object-cover"
                     />
                  </CardContent>
               </div>
            </Card>
         </a>
      </motion.div>
   );
}
