import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function ModeCard(props: any) {
   return (
      <Card className="flex flex-col items-center shadow-lg bg-gradient-to-br from-white to-gray-100">
         <CardHeader>
            <CardTitle>{props.title}</CardTitle>
            <CardDescription>{props.description}</CardDescription>
         </CardHeader>
         <CardContent>
            <img src={props.img} className="w-60 h-32 rounded-lg" />
         </CardContent>
         <CardFooter>
            <a href={props.link}>
               <Button>Play Now</Button>
            </a>
         </CardFooter>
      </Card>
   );
}
